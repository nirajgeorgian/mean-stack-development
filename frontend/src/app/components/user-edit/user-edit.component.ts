import { User } from "../../../models/user";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "./../../service/api.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.css"],
})
export class UserEditComponent implements OnInit {
  submitted = false;
  editForm: FormGroup;
  userData: User[];
  userProfileImagePath: string;

  constructor(
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.updateUser();
    let id = this.actRoute.snapshot.paramMap.get("id");
    this.getUser(id);
    this.editForm = this.fb.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: ["", [Validators.required]],
      phoneNumber: ["", [Validators.required]],
      profileImage: ["", []],
    });
  }

  // Getter to access form control
  get myForm() {
    return this.editForm.controls;
  }

  getUser(id) {
    this.apiService.getUser(id).subscribe((data) => {
      this.editForm.setValue({
        firstName: data["firstName"],
        lastName: data["lastName"],
        email: data["email"],
        phoneNumber: data["phoneNumber"],
        profileImage: data["profileImage"],
      });
    });
  }

  updateUser() {
    this.editForm = this.fb.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: ["", [Validators.required]],
      phoneNumber: ["", [Validators.required]],
      profileImage: ["", [Validators.required]],
    });
  }

  onFileSelect(event) {
    const file = event.target.files[0];
    // this.fileInputLabel = file.name;
    this.editForm.get("profileImage").setValue(file);
  }

  onSubmit() {
    this.submitted = true;
    if (!this.editForm.valid) {
      return false;
    } else {
      if (window.confirm("Are you sure?")) {
        let id = this.actRoute.snapshot.paramMap.get("id");

        const formData = new FormData();
        formData.append(
          "profileImage",
          this.editForm.get("profileImage").value
        );

        this.apiService
          .uploadProfilePicture(id, formData)
          .subscribe((response) => {
            this.userProfileImagePath = response.value;
            this.editForm.get("profileImage").setValue(response.value);
            this.apiService.updateUser(id, this.editForm.value).subscribe(
              (res) => {
                this.router.navigateByUrl("/user-list");
                console.log("Content updated successfully!");
              },
              (error) => {
                console.log(error);
              }
            );
          });
      }
    }
  }
}
