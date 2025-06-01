export class Organization {
  constructor({
    id = null,
    name = "",
    description = "",
    organizerId = null,
    email = "",
    phone = "",
    address = "",
    website = "",
    logo = null,
    status = "Activ", // Activ, Inactiv, În Așteptare
    createdAt = new Date(),
    updatedAt = new Date(),
    totalProjects = 0,
    totalVolunteers = 0,
    totalHours = 0,
    domains = [], // Areas of activity
    socialMedia = {
      facebook: "",
      instagram: "",
      linkedin: ""
    }
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.organizerId = organizerId;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.website = website;
    this.logo = logo;
    this.status = status;
    this.createdAt = new Date(createdAt);
    this.updatedAt = new Date(updatedAt);
    this.totalProjects = totalProjects;
    this.totalVolunteers = totalVolunteers;
    this.totalHours = totalHours;
    this.domains = domains;
    this.socialMedia = socialMedia;
  }

  toFirestore() {
    return {
      name: this.name,
      description: this.description,
      organizerId: this.organizerId,
      email: this.email,
      phone: this.phone,
      address: this.address,
      website: this.website,
      logo: this.logo,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      totalProjects: this.totalProjects,
      totalVolunteers: this.totalVolunteers,
      totalHours: this.totalHours,
      domains: this.domains,
      socialMedia: this.socialMedia
    };
  }
}