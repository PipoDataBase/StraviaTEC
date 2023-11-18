import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { _Comment } from '../models/comment.module';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getComments(): Observable<_Comment[]> {
    return this.http.get<_Comment[]>(this.baseApiUrl + '/api/Comment');
  }

  GetCommentsByActivity(activityId: string): Observable<_Comment[]> {
    return this.http.get<_Comment[]>(this.baseApiUrl + '/api/Comment/' + activityId);
  }

  postComment(comment: _Comment): Observable<boolean> {
    return this.http.post<boolean>(this.baseApiUrl + '/api/Comment', comment);
  }

  putChallenge(id: string, comment: _Comment): Observable<boolean> {
    return this.http.put<boolean>(this.baseApiUrl + '/api/Comment/' + id, comment);
  }

  deleteComment(id: string): Observable<boolean> {
    return this.http.delete<boolean>(this.baseApiUrl + '/api/Comment/' + id);
  }
}
