import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyToken = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: process.env.WEB_CLIENT_ID,
  });
  // console.log("google_client_id", process.env.WEB_CLIENT_ID);
  return ticket.getPayload();
};

export { verifyToken };
