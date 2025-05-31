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
    totalTasks = 0,
    donations = [],
    totalDonations = 0,
    lastDonationAt = null
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.organizationId = organizationId;
    this.managerId = managerId;
    this.status = status;
    this.priority = priority;
    this.startDate = startDate ? new Date(startDate) : null;
    this.endDate = endDate ? new Date(endDate) : null;
    this.maxVolunteers = maxVolunteers;
    this.currentVolunteers = currentVolunteers;
    this.requiredSkills = requiredSkills;
    this.location = location;
    this.createdAt = new Date(createdAt);
    this.updatedAt = new Date(updatedAt);
    this.totalHours = totalHours;
    this.completedTasks = completedTasks;
    this.totalTasks = totalTasks;
    this._progress = this.calculateProgress(); // Store progress internally
    this.donations = this.processDonations(donations);
    this.totalDonations = totalDonations || 0;
    this.lastDonationAt = lastDonationAt ? new Date(lastDonationAt) : null;
  }

  calculateProgress() {
    if (this.totalTasks === 0) return 0;
    return Math.round((this.completedTasks / this.totalTasks) * 100);
  }

  processDonations(donations) {
    if (!Array.isArray(donations)) return [];
    
    return donations.map(donation => ({
      amount: donation.amount || 0,
      donorName: donation.donorName || '',
      timestamp: donation.timestamp ? new Date(donation.timestamp) : new Date(),
      lastFourDigits: donation.lastFourDigits || ''
    }));
  }

  toFirestore() {
    return {
      title: this.title,
      description: this.description,
      organizationId: this.organizationId,
      managerId: this.managerId,
      status: this.status,
      priority: this.priority,
      startDate: this.startDate,
      endDate: this.endDate,
      maxVolunteers: this.maxVolunteers,
      currentVolunteers: this.currentVolunteers,
      requiredSkills: this.requiredSkills,
      location: this.location,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      totalHours: this.totalHours,
      completedTasks: this.completedTasks,
      totalTasks: this.totalTasks,
      progress: this._progress,
      donations: this.donations.map(donation => ({
        amount: donation.amount,
        donorName: donation.donorName,
        timestamp: donation.timestamp.toISOString(),
        lastFourDigits: donation.lastFourDigits
      })),
      totalDonations: this.totalDonations,
      lastDonationAt: this.lastDonationAt
    };
  }

  static fromFirestore(data, id) {
    return new Project({
      id,
      ...data,
      donations: Array.isArray(data.donations) ? data.donations : [],
      totalDonations: data.totalDonations || 0,
      lastDonationAt: data.lastDonationAt || null
    });
  }

  addDonation(donation) {
    const newDonation = {
      amount: donation.amount || 0,
      donorName: donation.donorName || '',
      timestamp: new Date(donation.timestamp || new Date()),
      lastFourDigits: donation.lastFourDigits || ''
    };

    this.donations.push(newDonation);
    this.totalDonations += newDonation.amount;
    this.lastDonationAt = newDonation.timestamp;
    this.updatedAt = new Date();

    return this;
  }

  getDonationsTotal() {
    return this.donations.reduce((total, donation) => total + donation.amount, 0);
  }

  getRecentDonations(limit = 5) {
    return [...this.donations]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  getFormattedTotalDonations() {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON'
    }).format(this.totalDonations);
  }

  get progress() {
    return this._progress;
  }

  get isComplete() {
    return this.status === 'Finalizat' || this.progress === 100;
  }
}