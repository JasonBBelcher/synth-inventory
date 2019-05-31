export default function havePermission(DecodedUserToCheck, createdBy) {
  if (
    DecodedUserToCheck.data.role === 'Admin' ||
    createdBy.user.equals(DecodedUserToCheck.data.id)
  ) {
    return true
  } else {
    return false
  }
}
