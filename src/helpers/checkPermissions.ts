import { ISynth, IToken } from "../ts-definitions/index";

export default function havePermission(
  DecodedUserToCheck: any,
  synthCreator: ISynth
) {
  if (
    (DecodedUserToCheck as IToken).data.role === "Admin" ||
    synthCreator.user.equals(DecodedUserToCheck.data.id)
  ) {
    return true;
  } else {
    return false;
  }
}
