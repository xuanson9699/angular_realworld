import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";

import { JwtService } from "./jwt.service";
import { map, distinctUntilChanged, tap, shareReplay } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { User } from "../user.model";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class UserService {

  // Đặc điểm của BehaviorSubject:
  //  Luôn giữ trạng thái hiện tại: Ngay cả khi một Subscriber đăng ký sau, nó sẽ nhận được giá trị hiện tại hoặc giá trị mặc định.
  //  Thường được sử dụng để lưu trạng thái (state) hoặc dữ liệu được chia sẻ giữa các component.
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  public isAuthenticated = this.currentUser.pipe(map((user) => !!user));

  constructor(
    private readonly http: HttpClient,
    private readonly jwtService: JwtService,
    private readonly router: Router,
  ) {}

  login(credentials: {
    email: string;
    password: string;
  }): Observable<User> {
    return this.http
      .post<User>("/users/login", { user: credentials })
      .pipe(tap((user) => this.setAuth(user)));
  }

  // register(credentials: {
  //   // username: string;
  //   email: string;
  //   password: string;
  // }): Observable<{ user: User }> {
  //   return this.http
  //     .post<{ user: User }>("/register", { ...credentials})
  //     .pipe(tap(({ user }) => this.setAuth(user)));
  // }

  register(credentials: {
    email: string;
    password: string;
  }): Observable<User> {
    return this.http
      .post<User>("/register", { ...credentials})
      .pipe(tap(( user ) => this.setAuth(user)));
  }

  logout(): void {
    this.purgeAuth();
    void this.router.navigate(["/"]);
  }

  getCurrentUser(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>("/user").pipe(
      tap({
        next: ({ user }) => this.setAuth(user),
        error: () => this.purgeAuth(),
      }),
      shareReplay(1),
    );
  }

  update(user: Partial<User>): Observable<{ user: User }> {
    return this.http.put<{ user: User }>("/user", { user }).pipe(
      tap(({ user }) => {
        this.currentUserSubject.next(user);
      }),
    );
  }

  setAuth(user: User): void {
    console.log('user', user)
    this.jwtService.saveToken(user.token);
    this.currentUserSubject.next(user);
  }

  purgeAuth(): void {
    this.jwtService.destroyToken();
    this.currentUserSubject.next(null);
  }
}
