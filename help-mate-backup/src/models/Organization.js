export class Organization {
  constructor({
    id = null,
    name = '',
    description = '',
    email = '',
    phone = '',
    address = '',
    website = '',
    logo = null,
    adminId = null,
    createdAt = new Date(),
    isActive = true,
    totalVolunteers = 0,
    totalProjects = 0,
    rating = 0
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.website = website;
    this.logo = logo;
    this.adminId = adminId;
    this.createdAt = createdAt;
    this.isActive = isActive;
    this.totalVolunteers = totalVolunteers;
    this.totalProjects = totalProjects;
    this.rating = rating;
  }
}