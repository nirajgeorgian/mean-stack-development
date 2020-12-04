import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../service/api.service";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.css"],
})
export class UserListComponent implements OnInit {
  users: any = [];

  constructor(private apiService: ApiService) {
    this.readUsers();
  }

  ngOnInit(): void {}

  readUsers() {
    this.apiService.getUsers().subscribe((data) => (this.users = data));
  }

  deleteUser(user, index) {
    if (window.confirm("Are you sure?")) {
      this.apiService.deleteUser(user._id).subscribe((data) => {
        this.users.splice(index, 1);
      });
    }
  }
}
