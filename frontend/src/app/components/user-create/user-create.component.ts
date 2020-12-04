import { Router } from "@angular/router";
import { ApiService } from "../../service/api.service";
import { Component, OnInit, NgZone } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-user-create",
  templateUrl: "./user-create.component.html",
  styleUrls: ["./user-create.component.css"],
})
export class UserCreateComponent implements OnInit {
  submitted = false;
  userForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService
  ) {
    this.mainForm();
  }

  ngOnInit(): void {}

  mainForm() {
    this.userForm = this.fb.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: ["", [Validators.required]],
      phoneNumber: ["", [Validators.required]],
      profileImage: ["", []],
    });
  }

  // Getter to access form control
  get myForm() {
    return this.userForm.controls;
  }

  onSubmit() {
    console.log("submitting form ...");
    this.submitted = true;
    if (!this.userForm.valid) {
      console.log(this.userForm);
      console.log("error in submit");
      return false;
    } else {
      this.apiService.createUser(this.userForm.value).subscribe(
        (res) => {
          console.log("User successfully created!");
          this.ngZone.run(() => this.router.navigateByUrl("/user-list"));
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
