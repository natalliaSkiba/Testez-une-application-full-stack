import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { describe, it, expect } from '@jest/globals';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service'; 
import { SessionService } from 'src/app/services/session.service';
import { Router } from '@angular/router';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent (Jest)', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  // Declare variables for mock services
  let authServiceMock: jest.Mocked<AuthService>;
  let routerMock: jest.Mocked<Router>;
  let sessionServiceMock: jest.Mocked<SessionService>;

  beforeEach(async () => {
    // Create mocks for services
    authServiceMock = {
      login: jest.fn(),
      // If there are more methods in AuthService, mock them as well (e.g., logout: jest.fn(), etc.)
    } as unknown as jest.Mocked<AuthService>;

    routerMock = {
      navigate: jest.fn(),
      // If there are more methods in Router, they can be mocked here
    } as unknown as jest.Mocked<Router>;

    sessionServiceMock = {
      logIn: jest.fn(),
      // Similarly for other methods
    } as unknown as jest.Mocked<SessionService>;

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: SessionService, useValue: sessionServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('form should contain email and password fields, initially empty', () => {
    const emailControl = component.form.get('email');
    const passwordControl = component.form.get('password');

    expect(emailControl).toBeTruthy();
    expect(passwordControl).toBeTruthy();
    expect(emailControl?.value).toBe('');
    expect(passwordControl?.value).toBe('');
  });

  it('email field should be required and have the correct format', () => {
    const emailControl = component.form.get('email');
    if (!emailControl) {
      fail('Email control was not found');
      return;
    }

    // 1) Check required validation
    emailControl.setValue('');
    expect(emailControl.valid).toBe(false);
    expect(emailControl.errors?.['required']).toBeTruthy();

    // 2) Invalid email format
    emailControl.setValue('not-email');
    expect(emailControl.valid).toBe(false);
    expect(emailControl.errors?.['email']).toBeTruthy();

    // 3) Correct email format
    emailControl.setValue('test@example.com');
    expect(emailControl.valid).toBe(true);
  });

  it('password field should be required', () => {
    const passwordControl = component.form.get('password');
    if (!passwordControl) {
      fail('Password control was not found');
      return;
    }

    // Check required validation
    passwordControl.setValue('');
    expect(passwordControl.valid).toBe(false);
    expect(passwordControl.errors?.['required']).toBeTruthy();

    // Provide a valid value
    passwordControl.setValue('123456');
    expect(passwordControl.valid).toBe(true);
  });

  it('should call authService.login with form data on submit', () => {
    // Set up form values
    const loginData = { email: 'test@example.com', password: '12345' };
    component.form.setValue(loginData);

    // Mock successful response
    authServiceMock.login.mockReturnValue(of({} as SessionInformation));

    // Call submit
    component.submit();

    // Verify service call
    expect(authServiceMock.login).toHaveBeenCalledTimes(1);
    expect(authServiceMock.login).toHaveBeenCalledWith(loginData);
  });

  it('should call sessionService.logIn and router.navigate("/sessions") on successful login', () => {
    authServiceMock.login.mockReturnValue(of({} as SessionInformation));

    component.submit();

    expect(sessionServiceMock.logIn).toHaveBeenCalledTimes(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should set onError to true on login failure', () => {
    // Simulate an error
    authServiceMock.login.mockReturnValue(throwError(() => new Error('Error')));

    component.submit();

    expect(component.onError).toBe(true);
  });
});
