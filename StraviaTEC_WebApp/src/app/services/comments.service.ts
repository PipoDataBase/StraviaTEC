import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.baseApiUrl + '/api/Comment');
  }

  GetCommentsByActivity(activityId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.baseApiUrl + '/api/Comment/' + activityId);
  }

  postComment(comment: Comment): Observable<boolean> {
    return this.http.post<boolean>(this.baseApiUrl + '/api/Comment', comment);
  }

  putChallenge(id: string, comment: Comment): Observable<boolean> {
    return this.http.put<boolean>(this.baseApiUrl + '/api/Comment/' + id, comment);
  }

  deleteComment(id: string): Observable<boolean> {
    return this.http.delete<boolean>(this.baseApiUrl + '/api/Comment/' + id);
  }
}
