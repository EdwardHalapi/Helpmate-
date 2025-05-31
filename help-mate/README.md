graph TB
    %% User Types
    Guest[👤 Guest User]
    Volunteer[🙋‍♀️ Volunteer User]
    Organizer[👨‍💼 Organization User]
    
    %% Core Database
    DB[(🗄️ Centralized Database)]
    
    %% Main Entities
    VolunteerProfiles[👥 Volunteer Profiles]
    Projects[📋 Projects]
    Tasks[✅ Tasks]
    Applications[📝 Applications]
    Donations[💰 Donations]
    Events[📅 Events]
    
    %% User Actions & Features
    subgraph "Guest Actions"
        GuestDonate[💳 Donate to Projects]
        CreateAccount[📝 Create Account<br/>Volunteer/Organization]
    end
    
    subgraph "Volunteer Features"
        ViewProjects[🔍 Browse Projects]
        ApplyProjects[📤 Apply to Projects]
        MyProjects[📊 My Assigned Projects]
        TaskManagement[✏️ Update Task Status<br/>Log Hours]
        ReceiveInvites[📧 Receive Event Invitations]
    end
    
    subgraph "Organizer Features"
        CreateProject[➕ Create Projects]
        InviteVolunteers[📬 Invite Volunteers<br/>from Platform]
        ManageTasks[📋 Assign Tasks<br/>to Volunteers]
        CreateEvents[🎉 Create Events<br/>Send Email Invitations]
        ProjectProgress[📈 View Project Progress<br/>Tasks/Volunteers Stats]
    end
    
    subgraph "Project Details View"
        Progress[📊 Progress Tracking]
        TasksFinished[✅ Completed Tasks]
        VolunteerCount[👥 Total Volunteers]
        NeededVolunteers[🔢 Volunteers Needed]
        ShareProject[🔗 Share Project]
    end
    
    %% Email System
    EmailSystem[📧 Email Notification System]
    
    %% Connections
    Guest --> GuestDonate
    Guest --> CreateAccount
    Guest --> DB
    
    Volunteer --> ViewProjects
    Volunteer --> ApplyProjects
    Volunteer --> MyProjects
    Volunteer --> TaskManagement
    Volunteer --> ReceiveInvites
    
    Organizer --> CreateProject
    Organizer --> InviteVolunteers
    Organizer --> ManageTasks
    Organizer --> CreateEvents
    Organizer --> ProjectProgress
    
    %% Database connections
    DB --> VolunteerProfiles
    DB --> Projects
    DB --> Tasks
    DB --> Applications
    DB --> Donations
    DB --> Events
    
    %% Feature connections to database
    ViewProjects --> Projects
    ApplyProjects --> Applications
    MyProjects --> Projects
    TaskManagement --> Tasks
    CreateProject --> Projects
    ManageTasks --> Tasks
    GuestDonate --> Donations
    CreateEvents --> Events
    InviteVolunteers --> VolunteerProfiles
    
    %% Project details connections
    Projects --> Progress
    Tasks --> TasksFinished
    VolunteerProfiles --> VolunteerCount
    Projects --> NeededVolunteers
    Projects --> ShareProject
    
    %% Email system connections
    CreateEvents --> EmailSystem
    EmailSystem --> ReceiveInvites
    
    %% Styling
    classDef userType fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef database fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef feature fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef action fill:#fff3e0,stroke:#e65100,stroke-width:2px
    
    class Guest,Volunteer,Organizer userType
    class DB,VolunteerProfiles,Projects,Tasks,Applications,Donations,Events database
    class ViewProjects,ApplyProjects,MyProjects,TaskManagement,CreateProject,InviteVolunteers,ManageTasks,CreateEvents,ProjectProgress feature
    class GuestDonate,CreateAccount,ReceiveInvites,Progress,TasksFinished,VolunteerCount,NeededVolunteers,ShareProject,EmailSystem action