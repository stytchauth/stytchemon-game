# Stytchemon

![Stytchemon sizzle reel](public/sizzle.gif?raw=true "Stytchemon")

Stytchemon is a retro themed game built with :heart: by Stytch team during one of our hackathons. We wanted to build something fun to show new employees how Stytch works and have some fun along the way.

Check out our [blog post](TODO) about it if you're curious to learn more.

# Play the game
You can play the game online at [https://stytchemon-game.vercel.app/](https://stytchemon-game.vercel.app/).

## How to play
When you first start the game you'll need to generate a key to the door, you can do this by sending an OTP code to your email or phone number. Once you've generated a key you can use it to open the door and start playing.

Once you're into the arcade, have fun!

## Controls
- `←` `→` `↑` `↓` to move
- `space` to shoot or jump

# Run the game yourself

## Setup the Stytch JavaScript SDK
Visit your Stytch Dashboard and enable the [JavaScript SDK](https://stytch.com/dashboard/sdk-configuration).

Next grab your  your `public_token`, you can find it in your [Stytch dashboard](https://stytch.com/dashboard/api-keys), and replace `<YOUR_PUBLIC_TOKEN>` in `src/shared.js` with the value.

## Install and run the game
Now install and run the game:

```
nvm use
npm install
npm run dev
```
The app is now available at localhost:9000, have fun!
