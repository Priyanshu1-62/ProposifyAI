import { upsertPromptProfiles } from "./seeds/promptProfiles";

async function main(){
    await upsertPromptProfiles();
}

main()
    .catch( (e) => {
        console.log(e);
        process.exit(1);
});

// npx prisma db seed