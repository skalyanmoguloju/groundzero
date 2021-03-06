﻿import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map'
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class AuthenticationService {
  private authenticated: boolean = false;
  public username: string = null;
  private oRoleAndMenu: Object = null;
  private oRoleAndMenuObservable: Observable<any> = null;

  private headers = new Headers({'Content-Type': 'application/json'});
  private options = new RequestOptions({headers: this.headers});

  constructor(public http: Http) {
    let sUserEmail = localStorage.getItem('userEmail');
    if (sUserEmail) {
      this.username = sUserEmail;
    }
  }

  authorize(username: string, password: string) {
    return this.http.post('/validate', JSON.stringify({email: username, password: password}), this.options)
      .map((response: Response) => {
        this.authenticated = true;
        //localStorage.setItem('currentUser', JSON.stringify(response));
        let result: Object;
        result = JSON.parse(response._body);
        localStorage.setItem('userEmail', result.response.email);
        return result;
      });
  }

  getRoleandMenuData(username: string) {
    if (this.oRoleAndMenu) {
      return Observable.of(this.oRoleAndMenu);
    } else if (this.oRoleAndMenuObservable) {
      return this.oRoleAndMenuObservable;
    } else {
      this.oRoleAndMenuObservable = this.http.post('/getMenuAndRoleItems', JSON.stringify({email: username}), this.options)
        .map((response: Response) => {
          this.oRoleAndMenuObservable = null;
          let result: Object;
          result = JSON.parse(response._body);
          this.oRoleAndMenu = result.response;

          const userInfo = this.oRoleAndMenu.userDetails;
          /*Temp dummy user details*/
          this.oRoleAndMenu.userInfo = {
            userName: userInfo.userId.firstName + ", " + userInfo.userId.lastName,
            userEmail: userInfo.userId.email,
            dateAdded: userInfo.userId.dateCreation,
            userRole: userInfo.roleId.roleName
          };

          return result.response;
        })
        .share();
      return this.oRoleAndMenuObservable;
    }
  }

  getAllLabs(roleid: any, managerEmail: string, ) {
    //this.http.post('/addLabs', JSON.stringify({email: managerEmail}), this.options)
    return this.http.post('/getLabs', JSON.stringify({email: managerEmail, roleId: roleid}), this.options)
      .map((response: Response) => {
        let result: Object;
        result = JSON.parse(response._body);
        return result;
      });
  }

  getEvents() {

    return this.http.get('showcase/resources/data/scheduleevents.json')
      .toPromise()
      .then(res => <any[]> res.json().data)
      .then(data => { return data; });
  }

  insertStudents(newstudents: any) {
    return this.http.post('/insertStudents', JSON.stringify({students: newstudents}), this.options)
      .map((response: Response) => {
        let result: Object;
        result = JSON.parse(response._body);
        return result;
      });
  }


  addlabs(info: any = {}) {
    return this.http.post('/addLabs', JSON.stringify({info}), this.options)
      .map((response: Response) => {
        //this.authenticated = true;
        //localStorage.setItem('currentUser', JSON.stringify(response));
        let result: Object;
        result = JSON.parse(response._body);
        return result;
      });
  }

  getStudents(labid: Array<Object>, roleId: any) {
    return this.http.post('/getstudents', JSON.stringify({labid: labid, role: roleId}), this.options)
      .map((response: Response) => {
        let result: Object;
        result = JSON.parse(response._body);
        return result;
      });
  }

  private CheckIfAuthenticated() {
    if (localStorage.getItem('currentUser') === null) {
      this.authenticated = false;
    } else {
      this.authenticated = true;
    }
  }

  public isAuthenticated() {
    return this.authenticated;
  }


  public signup(info: any = {}) {
    return this.http.post('/registration', JSON.stringify({info}), this.options)
      .map((response: Response) => {
        //this.authenticated = true;
        //localStorage.setItem('currentUser', JSON.stringify(response));
        let result: Object;
        result = JSON.parse(response._body);
        return result;
      });
  }

  public logout() {
    // remove user from local storage to log user out
    //this.authenticated = false;
    localStorage.removeItem('currentUser');
  }

  public getEquipments(userDetails: any) {
    let id: any = [];
    for (let i = 0; i < userDetails.length; i++) {
      id.push(userDetails[i].labId.id);
    }
    return this.http.post('/getEquipments', JSON.stringify({id}), this.options)
      .map((response: Response) => {
        //this.authenticated = true;
        //localStorage.setItem('currentUser', JSON.stringify(response));
        let result: Object;
        result = JSON.parse(response._body);
        console.log(result.response);
        return result.response;
      });
  }

  public addEquipment(equipment: any) {
    return this.http.post('/addEquipment', JSON.stringify({equipment}), this.options)
      .map((response: Response) => {
        //this.authenticated = true;
        //localStorage.setItem('currentUser', JSON.stringify(response));
        let result: Object;
        result = JSON.parse(response._body);
        console.log(result.response);
        return result.response;
      });
  }

  public forgotpassword(email :any)
  {
    return this.http.post('/forgotpassword', JSON.stringify({email}), this.options)
      .map((response: Response) => {
        let result: Object;
        result = JSON.parse(response._body);
        console.log(result.message);
        return result.message;
      });
  }

  public resetpassword(email :any, reset: any)
  {
    return this.http.post('/resetpassword', JSON.stringify({email,reset}), this.options)
      .map((response: Response) => {
        let result: Object;
        result = JSON.parse(response._body);
        console.log(result.message);
        return result.message;
      });
  }

  public labAccessRequest(currentLabId :any, requestedLabId: any)
  {
    return this.http.post('/labAccessRequest', JSON.stringify({currentLabId,requestedLabId}), this.options)
      .map((response: Response) => {
        let result: Object;
        result = JSON.parse(response._body);
        console.log(result.message);
        return result.message;
      });
  }

  public getUnrefferedLabs(LabId :any, email: any, roleId:any)
  {
    return this.http.post('/getUnrefferedLabs', JSON.stringify({LabidA: LabId, email: email, roleId: roleId}), this.options)
      .map((response: Response) => {
        let result: Object;
        result = JSON.parse(response._body);
        return result;
      });
  }

}
