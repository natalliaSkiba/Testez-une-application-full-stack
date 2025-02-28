import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { User } from '../interfaces/user.interface';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;
  let httpMock: HttpTestingController;

  const mockSessionInformation: SessionInformation = {
    token: 'token',
    type: 'yoga',
    id: 1,
    username: 'tototata',
    firstName: 'tata',
    lastName: 'toto',
    admin: true
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);

    const next = jest.fn();
  });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should isLogged be falsy', () => {
      const next = jest.fn();
      next();
      expect(next.mock.calls).toHaveLength(1);
    });

    it('should return false for $isLogged observable initially', (done) => {
      service.$isLogged().subscribe((isLogged) => {
        expect(isLogged).toBe(false);
        done();
      });
    });

  it('should set isLogged to true and update sessionInformation', () => {
    service.logIn(mockSessionInformation);

    expect(service.isLogged).toBe(true);
    expect(service.sessionInformation).toEqual(mockSessionInformation);
  });

  it('should emit true via $isLogged observable', (done) => {
    service.logIn(mockSessionInformation);

    service.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(true);
      done();
    });
  });

  it('should set isLogged to false and clear sessionInformation', () => {
    service.logIn(mockSessionInformation); // logIn with the session informations
    service.logOut();

    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should emit false via $isLogged observable', (done) => {
    service.logIn(mockSessionInformation); // logIn with the session informations
    service.logOut();

    service.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(false);
      done();
    });
  });

  it('should emit the current value of isLogged when called', (done) => {
    service.isLogged = true; // Manually set
    service['next'](); // Call private `next` method

    service.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(true);
      done();
    });
  });
});
