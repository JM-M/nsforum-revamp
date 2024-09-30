# Network Society Forum

A decentralized forum built on OrbisDB

## Getting Started

1. Setup OrbisDB.
   You can either [install locally](https://www.youtube.com/watch?v=8embizFvI-U) or sign up for on shared node [here](https://studio.useorbis.com/).

2. Create a default or root contexts and add it to the [contexts.ts file](shared/orbis/contexts.ts)

```ts
const contexts = {
  root: "<CONTEXT ID HERE>",
} as const;
```

2. Clone the main branch of this repo.

3. Add an env.local file.

4. Install dependencies.

```bash
npm install
```

5. Start the app.

```bash
npm run dev
```

5. Create orbisdb models.

```bash
npm run db:sync
```

6. Open [http://localhost:3000](http://localhost:3000) and sign in.

7. Go to the privy dashboard, copy the id of your user and add it to the ADMIN_PRIVY_IDS environment variable. You can add other admins if you wish.

```bash
ADMIN_PRIVY_IDS='["<YOUR USER ID>", "<ANOTHER ADMIN USER ID>"]'
```

8. Because every post must have a category, before trying to create a new post, you should create at least one category here [http://localhost:3000/admin/categories/new](http://localhost:3000/admin/categories/new).

9. You can now create new posts.

## Email Notifications

### Current Setup

We currently use AWS Lambda to handle email notifications. We plan to use an OrbisDB plugin once we move from a shared instance to a dedicated one.

The lambda functions are built and deployed with sst. You can find the code we used repo [here](https://github.com/JM-M/nsforum-sst)

If you wish to use the same setup, you can clone and deploy the sst repo above. You'll have to set the following env variable as the you sst app's url.

```bash
NEXT_PUBLIC_SST_URL=
```

### Set up your own

You can edit the notifySubscribers function in [here](app/posts/actions.ts)
