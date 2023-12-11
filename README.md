# K8S Resource Manager
A manager for resources in Kubernetes. The tool allows for monitoring and managing some of the standard Kubernetes resources (PersistentVolumeClaim, Services, Deployments, Jobs, and Secrets) as well as for managing a selection of Custom Resources.

## Back-end
Create an `application-local.yaml` file under `src/main/resources` and configure it as follows (notably, change `kubernetes.config` to point to your local configuration file):

``` yaml
#kubernetes
kubernetes:
  namespace: postgrest-operator-system
  config: file:///Users/your_user/.kube/config
  crd:
    allowed:
    denied: >
  selector:
    service: 

# authentication and authorization config
auth:
  basic:
    username: user
    password: password
  oauth2:
    issuer-uri: https://aac.platform.smartcommunitylab.it
    audience: client_id_for_auth2

security.cors.origins: http://localhost:3000
```
`kubernetes.crd.allowed` and `kubernetes.crd.denied` are meant to be mutually exclusive: you either specify one or the other (or leave both empty). Defining `allowed` will let the resource manager handle only the CRDs listed in it, while `denied` will allow all CRDs not listed in it. Leaving both empty lets the resource manager handle all CRDs. 

To control which standard resources are available to the Resource Manager, use the specific label selectors in the following way:

- `kubernetes.selector.service` (`K8S_SELECTOR_SERVICE`) defines the label selectors (separated by `|`) for filtering the K8S Services to read.
- `kubernetes.selector.deployment` (`K8S_SELECTOR_DEPLOYMENT`) defines the label selectors (separated by `|`) for filtering the K8S Deployments to read.
- `kubernetes.selector.job` (`K8S_SELECTOR_JOB`) defines the label selectors (separated by `|`) for filtering the K8S Jobs to read.
- `kubernetes.selector.pvc` (`K8S_SELECTOR_PVC`) defines the label selectors (separated by `|`) for filtering the K8S Persistent Volume Claims to read.

KRM allows for accessing a subset of secrets. To define which secrets to access, it is possible to use the following properties

- `kubernetes.secret.labels` (`K8S_SELECTOR_LABELS`) defines the label selectors (separated by `|`) for filtering the K8S Secrets to match.
- `kubernetes.secret.owners` (`K8S_SELECTOR_OWNERS`) list of comma-separated owner api versions (full form) to match.
- `kubernetes.secret.annotations` (`K8S_SELECTOR_ANNOTATIONS`) defines the annotation filters (separated by `|`) for filtering the K8S Secrets to match. The filter should have a form `<annotation>=<value>`.
- `kubernetes.secret.name` (`K8S_SELECTOR_NAMES`) list of comma-separated regular expressionds to match the secret name.

The secrets will be shown only if at least one of these filters match.

To control the creation of the Persistent Volume Claims, it is possible additional to define the following properties

- `kubernetes.pvc.managed-by` to define the label to be associated with the K8S Resoruce Manager
- `kubernetes.pvc.storage-classes` to define a subset of Storage Classes that can be created with K*S Resource Manager. If not specified, all classes are allowed.

Start the server:
```
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

## Front-end
Create a `.env.development` file under `frontend` and configure it as follows:
```
PUBLIC_URL="/"
REACT_APP_CONTEXT_PATH="/"
REACT_APP_AUTH = "basic"
REACT_APP_API_URL = "http://localhost:8080"
REACT_APP_AUTHORITY = ""
REACT_APP_CLIENT_ID = ""
REACT_APP_APPLICATION_URL = "http://localhost:3000"
REACT_APP_AUTH_CALLBACK_PATH = "/auth-callback"
REACT_APP_SCOPE = "openid profile"
```

Then, run the front-end (make sure to `cd` to `frontend` first):
```
npm start
```

You may receive an error if authentication is not configured for npm. Try configuring `frontend/.npmrc` as follows (set `authToken`):
```
always-auth=true
//npm.pkg.github.com/:_authToken=your_token
registry=https://registry.yarnpkg.com/ # for yarn

@smartcommunitylab:registry=https://npm.pkg.github.com
```

A browser page pointing to `localhost:3000` should automatically open. If you didn't change credentials, log in with `user` and `password`.

### Creating a schema from the UI

Go to *Settings* and pick a *CRD*. You can leave the *Schema* field empty and click *Save*, and the schema enabled in Kubernetes will be automatically picked up. However, you need to go edit the generated schema to add the following property at root level, otherwise you will be unable to manage the corresponding CRs:
```
"$schema":"https://json-schema.org/draft/2020-12/schema"
```
