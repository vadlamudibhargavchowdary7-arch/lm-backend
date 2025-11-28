const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.verifyGoogleToken = async (tokenId) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    return {
      name: payload.name,
      email: payload.email,
      picture: payload.picture
    };

  } catch (err) {
    console.error("Google token verification failed:", err.message);
    throw new Error("Invalid Google token");
  }
};
