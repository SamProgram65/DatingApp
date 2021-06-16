import { Component, Input, OnInit, Output,EventEmitter} from '@angular/core';
import { AbstractControl, ControlContainer, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  // model: any = {};
   registerForm: FormGroup;
   maxDate: Date;
   validationErrors: string[] = [];
 
  constructor(private accountService: AccountService, private toastr: ToastrService, 
    private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() -18);
  }

  initializeForm()
  {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['',Validators.required],
      knownAs: ['',Validators.required],
      dateOfBirth: ['',Validators.required],
      city: ['',Validators.required],
      country: ['',Validators.required],
      password: ['', [Validators.required, Validators.minLength(4) , Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    })

    // this.registerForm.controls.password.valueChanges.subscribe(() =>
    // {
    //   this.registerForm.controls.confirmPassword.updateValueAndValidity();
    // }
    // )
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
     
  //  this.accountService.register(this.model).subscribe(response => {
    
   this.accountService.register(this.registerForm.value).subscribe(response => {
    this.router.navigateByUrl('/members');
  
   },
   error=>{
    this.validationErrors = error;
        
   })
   }

  cancel()
  {
    this.cancelRegister.emit(false);
  }

}
