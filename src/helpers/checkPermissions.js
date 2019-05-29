export default function havePermission(DecodedUserToCheck, synthCreator) {
  if (
    DecodedUserToCheck.data.role === "Admin" ||
    synthCreator.user.equals(DecodedUserToCheck.data.id)
  ) {
    return true;
  } else {
    return false;
  }
}
