export default interface VkmEntry {
  vkm: string;
  keeperName: string;
  country: string;
  status: 'in use' | 'Blocked' | 'Revoked';
  www: string;
}
