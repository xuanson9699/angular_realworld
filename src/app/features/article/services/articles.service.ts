import { Article } from "./../models/article.model";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { ArticleListConfig } from "../models/article-list-config.model";

@Injectable({ providedIn: "root" })
export class ArticlesService {
  constructor(private readonly http: HttpClient) {}

  query(
    config: ArticleListConfig,
  ): Observable<{ data: Article[]; total: number }> {
    // Convert any filters over to Angular's URLSearchParams
    let params = new HttpParams();

    Object.keys(config.filters).forEach((key) => {
      // @ts-ignore
      params = params.set(key, config.filters[key]);
    });

    return this.http.get<{ data: Article[]; total: number }>(
      "/articles" + (config.type === "feed" ? "/feed" : ""),
      { params },
    );
  }

  get(slug: string): Observable<Article> {
    return this.http
      .get<{ article: Article }>(`/articles/${slug}`)
      .pipe(map((data) => data.article));
  }

  delete(slug: string): Observable<void> {
    return this.http.delete<void>(`/articles/${slug}`);
  }

  create(article: Partial<Article>): Observable<Article> {
    return this.http
      .post<{ article: Article }>("/articles/", { article: article })
      .pipe(map((data) => data.article));
  }

  update(article: Partial<Article>): Observable<Article> {
    return this.http
      .put<{ article: Article }>(`/articles/${article.slug}`, {
        article: article,
      })
      .pipe(map((data) => data.article));
  }

  favorite(slug: string): Observable<Article> {
    return this.http
      .post<{ article: Article }>(`/articles/${slug}/favorite`, {})
      .pipe(map((data) => data.article));
  }

  unfavorite(slug: string): Observable<void> {
    return this.http.delete<void>(`/articles/${slug}/favorite`);
  }

  get articles$() {
    return of<Article[]>([
      {
        slug: "tien-hai-thai-binh",
        title: "Tien Hai - Thai Binh",
        description: "https://cdn.pixabay.com/photo/2024/11/05/05/38/japancontest-9175030_960_720.jpg",
        body: "https://cdn.pixabay.com/photo/2024/11/05/05/38/japancontest-9175030_960_720.jpg",
        tagList: ['Thai Binh', 'Tien Hai'],
        createdAt: "01/01/2025",
        updatedAt: "10/12/2025",
        favorited: true,
        favoritesCount: 10,
        author: {
          username: "son",
          bio: "oke son",
          image:
            "https://cdn.pixabay.com/photo/2024/11/05/05/38/japancontest-9175030_960_720.jpg",
          following: true,
        },
        name: "string",
        year: 2025,
        color: "string",
      },
      {
        slug: "item-2",
        title: "/yen-dinh-thanh-hoa",
        description: "https://cdn.pixabay.com/photo/2024/12/13/14/45/real-estate-9265386_640.jpg",
        body: "https://cdn.pixabay.com/photo/2024/12/13/14/45/real-estate-9265386_640.jpg",
        tagList: ['yen dinh', 'thanh hoa'],
        createdAt: "01/02/2025",
        updatedAt: "11/12/2025",
        favorited: true,
        favoritesCount: 10,
        author: {
          username: "minh-un",
          bio: "minh un le",
          image:
            "https://cdn.pixabay.com/photo/2024/12/13/14/45/real-estate-9265386_640.jpg",
          following: true,
        },
        name: "string",
        year: 2025,
        color: "string",
      },
    ]).pipe(shareReplay(1));
  }

  getArticles(slug: string): Observable<Article> {
    return this.articles$.pipe(
      map((articles) => articles.find((article) => article.slug === slug)),
      map((article) => {
        if (!article) {
          throw new Error(`Article not found with slug ${slug}`);
        }
        return article;
      })
    );
  }
}
