# Hexagonal Chess

A basic implementation of [Gliński's hexagonal chess](https://en.wikipedia.org/wiki/Hexagonal_chess#Gli%C5%84ski's_hexagonal_chess)

## Acknowledgement

I "borrowed" some assets from [Flaticon](https://www.flaticon.com): the pieces are from [prettycons](https://www.flaticon.com/authors/prettycons) and the sun, moon and the favicon is from [Freepik](http://www.freepik.com/).

## Sidenotes

First of all, I have to say that I am not happy with this code base. I am okay with the game as it is but the code... 🤢

If you plan on looking into the code or contribute to it, the only thing I can say is that I am terribly sorry for what you're about to see. It's the definition of "good enough", 'cause it works (most of the time) and I just want to move on to other projects for the time being.

I also shamelessly copied all of the "web app" stuff from another project of mine (menu, backend, websocket, etc.) which I would love to redo from the ground up. I started this project as a "local only" game so all of these features came as an afterthought.

Other than this, I used the aforementioned Wikipedia page to create the rules for the game but I am not really familiar with the game so in case I made any mistakes on how the pieces move or anything, feel free to create an issue and let me know.

## Roadmap

Currently I am not planning on continuing to work on this project, but I have some ideas that are left to do, namely:

- Validate move on backend
- Fix promotion in online play
- Refactor code
- Rematch option
- Send request to players who are not playing currently
- Proper recognition of a check state
- Checkmate and game ending events
- Animations (on piece move)
- Sounds (music and/or sound effect on piece move)
- Tutorial
- Single player mode (against an AI)
- Show pieces that are off the board (and maybe only be able to promote to those)
