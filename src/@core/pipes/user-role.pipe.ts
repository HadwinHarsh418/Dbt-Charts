import { Pipe, PipeTransform } from '@angular/core';
import { Role } from 'app/auth/models';


@Pipe({
	name: 'userrole'
})
export class UserRolePipe implements PipeTransform {

	constructor() { }
	transform(value: any) {
        let role = Role.User;
        let o = parseInt(value);
        switch(o) {
            case 3: role =  Role.Admin;  break;
            case 2: role =  Role.Editor;  break;
            default : role =  Role.User; break;
          }
		return role;
	}

}