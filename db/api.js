import * as uuid from 'uuid';
import { promises as fs } from 'fs';
import { resolve } from 'node:path';
import { hashPassword, checkToken, createAuthTokens, knownErrors } from '#utils';
import { homePath } from '../home-path.js';

const { unlink } = fs;
const flightCollection = '/flights';
const userCollection = '/users';

export class Api {
  constructor({ db, useAsync }) {
    this.db = db;
    this.useAsync = useAsync;
  }
  async register(name, email, password) {
    const db = await this.db;
    const id = uuid.v4();
    const tokens = await createAuthTokens(id, name, email);
    const user = {
      id,
      name,
      email,
      password: await hashPassword(password),
      ...tokens,
    };
    await db.push(`${userCollection}[]`, user);
    return { ...tokens, id, name, email };
  }

  async login(email, password) {
    const db = await this.db;
    const hashedPass = await hashPassword(password);
    const allData = await db.getData(userCollection);
    const user = allData.find(u => u.email === email && u.password === hashedPass);
    if (!user) {
      return Promise.reject(knownErrors.badCredentials());
    }
    const tokens = await createAuthTokens(user.id, user.name, user.email);
    const index = await db.getIndex(userCollection, user.id);
    await db.push(`${userCollection}[${index}]`, tokens, false);
    return { id: user.id, name: user.name, email: user.email, ...tokens };
  }

  async refreshToken(token, refreshToken) {
    const db = await this.db;
    const indexToken = await db.getIndex(userCollection, token, 'token');
    if (indexToken === -1) {
      return Promise.reject(knownErrors.unauthenticated());
    }
    const user = await db.getData(`${userCollection}[${indexToken}]`);
    if (user.refreshToken !== refreshToken) {
      return Promise.reject(knownErrors.unauthenticated());
    }
    const tokens = await createAuthTokens(user.id, user.name, user.email);
    await db.push(`${userCollection}[${indexToken}]`, tokens, false);
    if (indexToken === -1) {
      return Promise.reject(knownErrors.unauthenticated());
    }
    return tokens;
  }

  async verifyToken(token) {
    const db = await this.db;
    const index = await db.getIndex(userCollection, token, 'token');
    if (index === -1) {
      return Promise.reject(knownErrors.unauthenticated());
    }
    try {
      const decoded = await checkToken(token);
      return { id: decoded.id, name: decoded.name, email: decoded.email };
    } catch (e) {
      return Promise.reject(knownErrors.unauthenticated());
    }
  }

  async getAllFlights(page, size, code) {
    const db = await this.db;
    const allData = await db.getData(flightCollection);
    let flights = allData;
    if (code) {
      flights = allData.filter(f => f.code.startsWith(code));
    }

    const start = (page - 1) * size;
    const end = start + size;
    return {
      total: allData.length,
      count: flights.length,
      resources: flights.slice(start, end),
    };
  }

  async getFlightsStatus(ids) {
    const db = await this.db;
    const allData = await db.getData(flightCollection);
    const idHash = ids.reduce((curr, id) => ({ ...curr, [id]: true }), {});
    return {
      resources: allData.reduce((curr, f) => {
        const { id, status, img } = f;
        return idHash[id] ? [...curr, { id, status, img }] : curr;
      }, []),
    };
  }

  async getCodeAvailability(code) {
    const db = await this.db;
    const allData = await db.getData(flightCollection);
    return { status: !allData.some(f => f.code === code) ? 'available' : 'unavailable' };
  }

  async getOneFlight(id) {
    const db = await this.db;
    const index = await db.getIndex(flightCollection, id);
    return index !== -1
      ? db.getData(`${flightCollection}[${index}]`)
      : Promise.reject(knownErrors.notFound());
  }

  createOneFlight(data, photo) {
    const id = uuid.v4();
    return this.createOrUpdateFlight(false, id, data, photo);
  }

  async updateOneFlight(id, data, photo) {
    return this.createOrUpdateFlight(true, id, data, photo);
  }

  async deleteOneFlight(id) {
    const db = await this.db;
    const index = await db.getIndex(flightCollection, id);
    const flight = await db.getData(`${flightCollection}[${index}]`);
    if (flight.img) {
      await this.deleteImage(flight.img);
    }
    if (index !== -1) {
      await db.delete(`${flightCollection}[${index}]`);
    }
  }

  async createOrUpdateFlight(editing, id, newData, photo) {
    const db = await this.db;
    const matchingCodeIndex = await db.getIndex(flightCollection, newData.code, 'code');
    const status = photo ? 'processing' : 'none';
    const flightResource = { id, img: '', status, ...newData };
    if (editing) {
      const flightIndex = await db.getIndex(flightCollection, id);
      if (flightIndex === -1) {
        return Promise.reject(knownErrors.notFound());
      }
      if (matchingCodeIndex !== -1 && matchingCodeIndex !== flightIndex) {
        return Promise.reject(knownErrors.codeTaken());
      }
      const flight = await db.getData(`${flightCollection}[${flightIndex}]`);
      if (flight.img) {
        await this.deleteImage(flight.img);
      }
      await db.push(`${flightCollection}[${flightIndex}]`, flightResource);
    } else {
      if (matchingCodeIndex !== -1) {
        return Promise.reject(knownErrors.codeTaken());
      }
      await db.push(`${flightCollection}[]`, flightResource);
    }

    if (photo) {
      if (this.useAsync) {
        const minutes = Math.floor(Math.random() * 3 + 1);
        const time = minutes * 60000;
        setTimeout(() => this.updateImageStatus(id, photo), time);
      } else {
        await this.updateImageStatus(id, photo);
      }
    }
    return flightResource;
  }

  async updateImageStatus(id, photo) {
    const db = await this.db;
    const index = await db.getIndex(flightCollection, id);
    if (index !== -1) {
      await db.push(`${flightCollection}[${index}]`, { img: photo, status: 'ready' }, false);
    }
  }

  async deleteImage(img) {
    try {
      await unlink(resolve(homePath, `uploads/${img}`));
    } catch (e) {
      return Promise.reject(knownErrors.fileError());
    }
  }
}
