export class Project {
  constructor({
    id = null,
    title = '',
    description = '',
    organizationId = null,
    managerId = null,
    status = 'Planificat', // Planificat, Activ, Finalizat, Anulat
    priority = 'Medie', // Scăzută, Medie, Ridicată
    startDate = null,
    endDate = null,
    maxVolunteers = 0,
    currentVolunteers = 0,
    requiredSkills = [],
    location = '',
    createdAt = new Date(),
    updatedAt = new Date(),
    totalHours = 0,
    completedTasks = 0,
    totalTasks = 0
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.organizationId = organizationId;
    this.managerId = managerId;
    this.status = status;
    this.priority = priority;
    this.startDate = startDate;
    this.endDate = endDate;
    this.maxVolunteers = maxVolunteers;
    this.currentVolunteers = currentVolunteers;
    this.requiredSkills = requiredSkills;
    this.location = location;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.totalHours = totalHours;
    this.completedTasks = completedTasks;
    this.totalTasks = totalTasks;
  }

  get progress() {
    if (this.totalTasks === 0) return 0;
    return Math.round((this.completedTasks / this.totalTasks) * 100);
  }

  get isComplete() {
    return this.status === 'Finalizat' || this.progress === 100;
  }
}