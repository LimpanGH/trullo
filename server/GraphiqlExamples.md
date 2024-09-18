<!-- Get all users -->

{
users {
id
name
email
}
}

<!-- Add user -->

mutation {
addUser(name: "gert Smith", email: "alice.smith@example.com", password: "mypassword123") {
id
name
email
password
}
}

<!-- Get user by id -->

query {
task(id: "task-id") {
id
title
description
status
assignedTo
}
}
