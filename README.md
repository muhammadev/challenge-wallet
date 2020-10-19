# Challenge Wallet

### The Main Goal
Simply, you and your friends can register and start and new challenge, set deadline, and set losing cost.

### App Pages
1. Register Page
2. Login Page
3. Create A Challenge Page
4. Edit A Challenge Page
5. Home Page

### Create A Challenge Analysis
1. Set name.
2. Set rules, deadline, and cost.
3. Invite friends by @username.
4. set as global or privite.
5. Done.

### Routes
1. "/create" gives the user the chance to create a new challenge

### Requirements To Make A Challenge
1. Name must be set by challenger.
2. deadline can be set by default: (current time), or set by challenger.
3. cost is 1 egp by default and challenger can change it either to 0 or more than 1.
4. rules must be set by challenger.
5. creator is set behind the scenes as the email of the user who created the challenge.
6. participants can be invited by any other participant.

### What does join mean?
- a user can have several roles, such as:
    1. owner [super user] : owner role means you own the challenge and you can hide it from the global wall, delete it, edit it, or set the admins. you own what you create.

    2. admin: admins are set by owner. he can edit a challenge, hide it from the global wall, ban participants, or set other admins. admins can not delete a challenge or remove admins.

    3. participant: participants are those who join a challenge, they can customize the cost or the deadline only to themselves when is available.

    4. regular: regular user can create a challenge, thus be an owner, or join other challenges, or just explore the global wall's challenges. Every user is a regular user at least.

- when regular user join a challenge, then his db is updated to state that he is participating in that challenge and the cost start to be collected by deadlines.

- when a user recieves an invitation, he must accept first to join the challenge and the cost start to be collected.

- Action Schema
    user >> join >> {
        challenge >> [UPDATED] >> participants : {..., userId: "participant"},
        user >> [UPDATED] >> challenges : {..., challengeId: "participant"}
    }