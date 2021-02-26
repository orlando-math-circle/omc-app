import { withDocus } from "docus";

export default withDocus({
  docus: {
    colors: {
      primary: "#E25F55"
    }
  },
  env: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN
  }
});
