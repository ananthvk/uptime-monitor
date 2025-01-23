# Up-time Monitoring Service

A up-time monitoring service periodically checks a service/server to determine if it is online or not. It also collects various useful statistics such as response time, presence of certain keywords, etc. The service can also be used to send alerts in case a downtime occurs, so that prompt action can be taken.

Such services are useful to business owners, organizations and people who host websites since prompt action can be taken in case the service is not operational. These situations can arise due to a variety of reasons such as traffic overload, program bug, hardware failure or network issues. Instead of losing a lot of time in waiting for the customer to report the issue, and degrading customer experience, a up-time monitoring service can send out alerts immediately.

## How to run?

```
$ git clone https://github.com/ananthvk/uptime-monitor
$ cd uptime-monitor
$ docker compose up
```
The first run will fail since the database has not been created yet, to do so
```
$ docker ps
```
Get the container id for the `postgres` container, say `abcd`

Then run,
```
$ docker exec -it abcd ash
$ psql -U postgres
# CREATE DATABASE upmonitor;
```

Shutdown the previous compose and run it again with
```
$ docker compose up
```

## Screenshots
![Screenshot of the dashboard page of the app](readme/dashboard.png?raw=true)
![Screenshot of a single monitor](readme/monitor.png?raw=true)


# Design

## User Requirements

### Basic Requirements

1. The user can sign up , log in , log out , reset password and other common authentication methods.
2. The user can monitor a website/service by adding a URL, port, type of monitor and time interval between checks. The number and type of parameters can vary among different monitors. There should be a minimum time interval (for example 30s) so that the service does not generate too many requests. The user can monitor multiple services, can add/edit/remove monitors
3. The user can view the status of the service (operational/failure/check in progress) and view certain metrics such as average latency and response time.
4. The user can also view past history of a service - view daily, weekly, monthly and yearly graphs.

### Additional Requirements

1. The user can view the status of the last N checks in the dashboard page for each monitor (green if successful, red if failed)
2. The graph which shows the response time can be updated in real time as the check gets completed without the user refreshing the page.
3. The user can configure the monitor to send an alert if a check fails for N consecutive number of times. The user can choose multiple notification providers such as Email, Telegram, SMS, WhatsApp, etc
4. The user can specify custom authentication strategies, custom headers and body for HTTP monitors

## Additional Notes

1. As an optimization, in case there are duplicate monitors (by the same or different users), the website check code needs to be run only once.

## Design

- There will be three main modules - The user interface module, the task runner module and the alerts module. The job of the user interface module is to create/edit/and delete monitors, and display the live status of a site.
- The task runner module will perform site checks as specified by the monitor and run the tasks periodically. New results are added to the database.
- The alerts module monitors the result of a site check and sends a notification if necessary.

## Database Schema

Since there are a limited number of types of monitors, and to keep the code simple, this project will use a single table to represent a monitor irrespective of its type. One downside of this approach is that there will be a lot of NULL values in the rows.

These are the main tables for storing information,
```
Monitor:
--------
monitor_id
user_id
name
date_created
type
url
port
method
```

```
Tag:
-------
tag_id
user_id
name

MonitorTag
----------
tag_id
monitor_id
```

```
User:
-------
user_id
email
date_registered
first_name
last_name
password
```

```
Heartbeat:
---------
heartbeat_id
date_checked
monitor_id
result
status_code
response_time
```

```
Incident:
---------
user_id
incident_id
date
severity
```

## Tech Stack:

- Backend: Nest.js
- Frontend: Reactjs
- Database: Postgres
- Message queue: Redis

## Expected Duration

3 weeks - 1 week to implement basic functionality, user login and authentication.
1 week to implement site checks module
1 week to implement alerts

## Tasks

- [x] Set up the backend and frontend development tools, make a simple hello world application using the chosen tech stack.
- [x] Setup database connections
- [x] Implement CRUD for Monitor table. (Create a default user with id 0, to implement this feature)
- [x] Implement service check, task runner
- [ ] Make the timeout configurable (from the monitor), store the error reason in db
- [x]  Adding heartbeat result to the database
- [x] Implement displaying heartbeat result on the monitor page
- [x] Implement getting the response time
- [x] Display the response time as a graph
- [ ] Add error boundaries, so that only the erring component is not displayed
- [ ] Implement clearing of status data with a button click
- [ ] Create event listener, that checks if a job has failed for x times
- [ ] Implement stopping checks after a number of failed attempts, back off
- [ ] Implement detection of incident, for now, log the incident to a file/console
- [x] Implement a dashboard page to view all monitors and brief information about each one of the monitors
- [ ] Sending of alerts through various channels - email, whatsapp, sms, etc
- [ ] Implement past history of a monitor, show graphs for the last 7 days, last month, last 6 months and other kinds of filters
- [ ] Implement filtering monitors and search capability
- [ ] Implement tagging, i.e. the user can add multiple tags to filter Monitors
- [ ] Implement user registration, login, logout, password reset
- [x] Implement live status display on the monitor page using
- [ ] [Optional] Try to implement it with websockets
- [ ] Add limits to the minimum heartbeat interval, maximum number of monitors that can be created by a single user
- [ ] Implement custom body/headers for HTTP checks
- [ ] Implement other forms of service checks

## Additional Tasks

- [ ] Share types between frontend and backend using class validators
- [ ] Show popup screen before deletion
- [ ] Implement alerts popup at bottom of screen

