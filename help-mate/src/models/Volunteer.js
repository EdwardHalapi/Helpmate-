export class Volunteer {
  constructor({
    id = null,
    firstName = "",
    lastName = "",
    email = "",
    phone = "",
    age = null,
    experience = "Începător",
    rating = 0,
    totalProjects = 0,
    totalHours = 0,
    skills = [],
    availability = [],
    status = "Activ", // Activ, Inactiv, În Așteptare
    profileImage = null,
    joinDate = new Date(),
    lastActive = new Date(),
    organizationId = null,
    projects = [],
  }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.age = age;
    this.experience = experience;
    this.rating = rating;
    this.totalProjects = totalProjects;
    this.totalHours = totalHours;
    this.skills = skills;
    this.availability = availability;
    this.status = status;
    this.profileImage = profileImage;
    this.joinDate = joinDate;
    this.lastActive = lastActive;
    this.organizationId = organizationId;
    this.projects = projects; // Array of project IDs or objects
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  get initials() {
    return `${this.firstName.charAt(0)}${this.lastName.charAt(
      0
    )}`.toUpperCase();
  }

  get experienceYears() {
    if (this.experience === "Începător") return 0;
    return parseInt(this.experience.replace(/\D/g, "")) || 0;
  }
}
