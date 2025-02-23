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

  // Объявляем переменные для поддельных (mock) сервисов
  let authServiceMock: jest.Mocked<AuthService>;
  let routerMock: jest.Mocked<Router>;
  let sessionServiceMock: jest.Mocked<SessionService>;

  beforeEach(async () => {
    // Создаём «издёвки» для сервисов
    authServiceMock = {
      login: jest.fn(),
      // Если в AuthService есть ещё методы, их также нужно замокать (например: logout: jest.fn(), и т.п.)
    } as unknown as jest.Mocked<AuthService>;

    routerMock = {
      navigate: jest.fn(),
      // Если в Router есть ещё методы, их можно тут замокать
    } as unknown as jest.Mocked<Router>;

    sessionServiceMock = {
      logIn: jest.fn(),
      // Аналогично для других методов
    } as unknown as jest.Mocked<SessionService>;

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule,
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

  it('должен создаваться', () => {
    expect(component).toBe;
  });

  it('форма должна содержать поля email и password, которые изначально пустые', () => {
    const emailControl = component.form.get('email');
    const passwordControl = component.form.get('password');

    expect(emailControl).toBeTruthy();
    expect(passwordControl).toBeTruthy();
    expect(emailControl?.value).toBe('');
    expect(passwordControl?.value).toBe('');
  });

  it('поле email должно быть обязательным и иметь правильный формат', () => {
    const emailControl = component.form.get('email');
    if (!emailControl) {
      fail('Контрол email не был найден');
      return;
    }

    // 1) Проверяем required
    emailControl.setValue('');
    expect(emailControl.valid).toBe(false);
    expect(emailControl.errors?.['required']).toBeTruthy();

    // 2) Некорректный email
    emailControl.setValue('not-email');
    expect(emailControl.valid).toBe(false);
    expect(emailControl.errors?.['email']).toBeTruthy();

    // 3) Корректный email
    emailControl.setValue('test@example.com');
    expect(emailControl.valid).toBe(true);
  });

  it('поле password должно быть обязательным', () => {
    const passwordControl = component.form.get('password');
    if (!passwordControl) {
      fail('Контрол password не был найден');
      return;
    }

    // Проверяем required
    passwordControl.setValue('');
    expect(passwordControl.valid).toBe(false);
    expect(passwordControl.errors?.['required']).toBeTruthy();

    // Заполняем правильным значением
    passwordControl.setValue('123456');
    expect(passwordControl.valid).toBe(true);
  });

  it('при submit должен вызываться authService.login с данными формы', () => {
    // Настраиваем форму
    const loginData = { email: 'test@example.com', password: '12345' };
    component.form.setValue(loginData);

    // Мокаем успешный результат
    authServiceMock.login.mockReturnValue(of({} as SessionInformation));

    // Вызываем submit
    component.submit();

    // Проверяем вызов сервиса
    expect(authServiceMock.login).toHaveBeenCalledTimes(1);
    expect(authServiceMock.login).toHaveBeenCalledWith(loginData);
  });

  it('при успешном логине вызывается sessionService.logIn и router.navigate("/sessions")', () => {
    authServiceMock.login.mockReturnValue(of({} as SessionInformation));

    component.submit();

    expect(sessionServiceMock.logIn).toHaveBeenCalledTimes(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('при ошибке логина onError становится true', () => {
    // Имитация ошибки
    authServiceMock.login.mockReturnValue(throwError(() => new Error('Ошибка')));

    component.submit();

    expect(component.onError).toBe(true);
  });
});
