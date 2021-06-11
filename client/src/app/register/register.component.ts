import { Component, Input, OnInit, Output,EventEmitter} from '@angular/core';
import { AbstractControl, ControlContainer, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { error } from 'selenium-webdriver';
import { AccountService } from '../_services/account.service';
// import * as EventEmitter from 'node:events';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
 
  // @Input() usersFromHomeComponent: any;
  @Output() cancelRegister = new EventEmitter();
   model: any = {};
   registerForm: FormGroup;
 
  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm()
  {
    this.registerForm = new FormGroup({
      username: new FormControl('',Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(4) , Validators.maxLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')])
    })

    this.registerForm.controls.password.valueChanges.subscribe(() =>
    {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    }
    )
  }

    matchValues(matchTo: string) : ValidatorFn {
      return (control: AbstractControl) => {
        const c =control?.parent?.controls as any;
        return(c)
        ? (control?.value === c[matchTo]?.value) ?
        null  : {isMatching: true} :null;
      }
    }
   register(){
     console.log(this.registerForm.value);
  //  this.accountService.register(this.model).subscribe(response => {
  //    console.log(response);
  //    this.cancel();
  //  },
  //  error=>{
  //    console.log(error);
  //    this.toastr.error(error.error);
  //    ;
     
  //  })
   }

  cancel()
  {
    this.cancelRegister.emit(false);
  }

}
