# oauth-aggregator

This takes multiple oauth providers, aggregates them into a nice easy-to-consume service, and handles all the exchanges back and forth.

## what this is

I want a simple, configurable, nice-looking UX that lets users sign in.

## what this is not

- an IAM provider
- an AuthZ server

# Brand Guidelines

The following sign in providers have brand guidelines:

- [Microsoft](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-add-branding-in-azure-ad-apps)
- [Google](https://developers.google.com/identity/branding-guidelines)
- [Reddit](https://www.reddit.com/wiki/licensing)

When possible I try to adhere to the brand guidelines. Specifically, I'm looking at:

- colors
- symbols
- fonts

Branding guidelines follow different standards. Some specify interaction logic, some specify gutter positioning, etc.

I'm trying to have a:
- consistent look
- consistent behavior
- consistent terminology (Sign in with X)

Each provider gets around 54 pixels to play with vertically, a square region on the left for a logo, a custom font, and a custom border color when the user focuses and mouse overs.