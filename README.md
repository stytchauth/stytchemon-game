# Stytchemon

<p align="center">
  <image src="public/sizzle.gif?")></image>
</p>

Stytchemon is a retro themed game built with :heart: by Stytch team during one of our internal hackathons. We wanted to build something fun to show new employees how Stytch works and have some fun along the way.

# Play the game
You can play the game online at [https://stytchemon-game.vercel.app/](https://stytchemon-game.vercel.app/).

## How to play

**Controls**
- `←` `→` `↑` `↓` to move
- `space` to shoot, jump, or select a menu item

When you first start the game you'll need to generate a key to the door, you can do this by sending an OTP code to your email or phone number. Once you've generated a key you can use it to open the door and enter the arcade.

Once you're into the arcade there are three mini games to play, have fun!

# Run the game yourself

## Setup the Stytch JavaScript SDK
Visit your Stytch Dashboard and enable the [JavaScript SDK](https://stytch.com/dashboard/sdk-configuration).

Next grab your  your `public_token`, you can find it in your [Stytch Dashboard](https://stytch.com/dashboard/api-keys), and create your `.env` file:
```
cp .env.template .env
# Then add your public_token to .env
```

## Install and run the game
Now install and run the game:

```
nvm use
npm install
npm run dev
```
The app is now available at http://localhost:9000/, have fun!

## Get help and join the community

#### :speech_balloon: Stytch community Slack

Join the discussion, ask questions, and suggest new features in our ​[Slack community](https://stytch.slack.com/join/shared_invite/zt-2f0fi1ruu-ub~HGouWRmPARM1MTwPESA)!

#### :question: Need support?

Check out the [Stytch Forum](https://forum.stytch.com/) or email us at [support@stytch.com](mailto:support@stytch.com).
