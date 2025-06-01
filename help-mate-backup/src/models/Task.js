export class Task {
  constructor({
    id = null,
    title = '',
    description = '',
    projectId = null,
    assignedVolunteerId = null,
    status = 'Nou', // Nou, În Progres, Finalizat, Blocat
    priority = 'Medie',
    estimatedHours = 0,
    actualHours = 0,
    dueDate = null,
    createdAt = new Date(),
    updatedAt = new Date(),
    completedAt = null,
    tags = []
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.projectId = projectId;
    this.assignedVolunteerId = assignedVolunteerId;
    this.status = status;
    this.priority = priority;
    this.estimatedHours = estimatedHours;
    this.actualHours = actualHours;
    this.dueDate = dueDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.completedAt = completedAt;
    this.tags = tags;
  }

  get isOverdue() {
    return this.dueDate && new Date() > this.dueDate && this.status !== 'Finalizat';
  }

  get isCompleted() {
    return this.status === 'Finalizat';
  }
}