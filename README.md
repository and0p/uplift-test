Jotting down thoughts as I work:

- I think you need to use triple backticks to indicate code in a github commit message, so `npx ts-jest config:init` is missing from 890dd45
- I'm thinking of just using the `index.ts` file here for all the logic. The kata specified core logic so I'm building as a module, so not using an express server or anything where I'm putting the logic in a service.
- I'm a fan of conventional commits but usually only when there are JIRA tickets or other tracking information to accompany them.
- I'm calling `exports.someFunction` in the `evaluateClaims` function to simplify mocking. In the context of a full application these could go into separate files, but for this exercise it seems sufficient.


Per the instruction email:

- Instructions for running the app
    - Because this is just a module, there are none. It can be built and linked locally, though.
- Any decisions or trade-offs you made
    - The use of `exports` within `index.ts` isn't ideal. It's not a totally invalid pattern for supporting mocking, nor is it as invasive as some styles of dependency injection, but still feels like a workaround.
    - The existence of a `policyId` within the `Claims` interface in the instructions indicates that perhaps there should be a lookup happening? It would be simple to add a quick lookup in a static object.
- Anything you’d do with more time
    - The architecture could be more robust. This type of processing could fit into a "business rules engine"-style architecture well, which would also allow real-time manipulation of behaviors without the need to deploy new code. Short of that I can imagine an engine that could handle more complex flows or interactions between criteria.