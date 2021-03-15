With the rise in microsservices, having to integrate with other microservices is key part. While developing an integrated solution, developer needs to try, verify his parameters. even after checking parameters, there still some gap where dev missing few parameters, few headers and required payload (desired vs actuall).


Dothttp `Dev` Portal provides protal for dev, where dev can create project. Project is a collection of requests related to specific use case. All logged in users have a default project created for him/her.

Most of what dothttp-dump can be done via proxy. but there were some disadvantages.
- going with proxy, will pamper dev to use our service as proxy.
- response payload may be huge which could pose problems to our service
- ssl level issues(even with https proxy)

## Project
Project provides below capabilities.
- Inbound url with which dev can post request
- List of requests
- add request via web page
- delete/modify existing request
- share request/snapshot with list of users.
- export all requests 
  - httpfile
  - postman
  
## Request
Each request typicall will have
- request id
- request name
- request description
- date (created)
- export curl/python requests/nodejs fetch
- http
  - > list of http files with date modified, username
  - history of up to 100 last edits are saved (although who would want to go back to last hundred)


## Sharing
- Snapshot
  - Public link sharing
    - any one can view requests (few headers can be sensitive)
  - Share to specic user/email
    - Share can Share to already existing users and to an email id.
  - Editing
    - Sharable are editable but not syncted to original user
    - Other options
      - import requests to your project and share
      - Edit as you please and export from webpage (postman/httpfile)
- Collaborator
  - Collaborators can add to history
- Quota
  - Sharee can share as many requests as he pleases
