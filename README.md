<img width="1524" alt="image" src="https://github.com/user-attachments/assets/c549c318-c461-4c5a-bbf4-81786e764276">


## Inspiration
As teammates, we're doing off-season internships, and one thing we agreed on is that it's sooooo tough to both break the ice and find engaging activities during team meetings.

And what we got out of that was......27 hours of planning, **96 different ideas from ChatGPT (yeah, even this failed), and one, incredibly fun all-nighter.

Inspired by Pictogram, Hangman, and even tools like Figma and Excalidraw, we knew something fun and interactive that could be a go-to for “water-cooler” moments would be awesome to try out during a hackathon. We also saw the need for this in our school clubs, so we decided to build a game that brings people together with a fun and competitive edge!

## What it does
Skribbl.ai is a competitive drawing game where two players compete to replicate an image given through a prompt, all on a shared virtual whiteboard.

Elevated with real-time video, voice, and chat, players can communicate and collaborate while racing against time to impress the AI judge, which scores the drawings based on accuracy.

## How we built it
We used several key technologies:

- **100ms** for real-time video and voice features.
- **ChromaDB** to handle data storage for user interactions.
- **tldraw** and **tldraw sync** for real-time collaborative white-boarding primitives.
- **React** and **TypeScript** to power the frontend.
- **NextAuth** for user authentication and session management.

Despite starting at 9 pm on the Saturday before the hackathon's end, we managed to pivot from our original idea (voice-powered music production) and complete this project in record time.

## Challenges we ran into
- Our original idea of voice-powered music production wasn't compatible with the sponsor Hume's technology, forcing us to pivot.
- The tight deadline, constant pivoting, and beyond late start added additional pressure, but we powered through to deliver a fully functional app by the end of the hackathon.
- The Metreon WiFi, especially when building a network-heavy application, led to many hotspots and remote work.

## Accomplishments that we're proud of
We’re incredibly proud of how quickly we pivoted and built a polished app with video, voice, chat, and whiteboard integration in a matter of hours. Finishing the project under such time constraints felt like a huge accomplishment. Yeah, we may not have the crazy large feature set, but we do the one thing we planned to do, really well–at least, we think.

## What we learned
We learned how to adapt quickly when things don’t go as planned, and we gained valuable experience integrating real-time video and collaboration features with technologies like 100ms, ChromaDB, and tldraw. 
We also learned perseverance and pushing through idea droughts. Since we're working, adjusting "back" to the hackathon mindset definitely takes time.

## What's next for Skribbl.ai
We’re super stoked to continue improving Skribbl.ai after CalHacks. We surprisingly—especially given our execution, see potential for the app to be used in virtual team-building exercises, school clubs, and social hangouts. Stuff like:

- **Multiplayer modes:** Expand to support larger groups and team-based drawing challenges.
- **Advanced AI judging:** Improve the AI to evaluate drawings based on creativity, style, and time taken, not just accuracy.
- **Custom game modes:** Allow users to create custom challenges, themes, and rules for personalized gameplay.
- **Leaderboard and achievements:** Introduce a ranking system, badges, and awards for top players.
- **Mobile app:** Develop a mobile-friendly version to make the game accessible across different devices.
- **Interactive spectators:** Let spectators participate in the game through voting or live commenting during matches.
- **Real-time drawing hints:** Implement features where players can give or receive subtle hints during gameplay without breaking the challenge.
- **Custom avatars and themes:** Offer players options to personalize their in-game experience with unique avatars, themes, and board designs.

All this stuff seems super exciting to build, and we're glad to have a baseline to expand off of.

Well, that's it for skribbl.ai, thanks for reading!

## Built With
- 100ms
- ChromaDB
- Gemini
- GoDaddy
- OpenAI
- RadixUI
- React
- tldraw
- tRPC
- TypeScript

## Try it out
- [GitHub Repo](https://github.com/drawing-is-for-kids-they-say)
- [Play Skribbl.ai](https://drawing-is-for-kids-they-say.vercel.app)
