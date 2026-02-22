exports.ROLES = {
  GUEST: 'guest',
  PENTESTER: 'pentester',
  ADMIN: 'admin'
};

exports.BOX_STATUSES = {
  TODO: 'Todo',
  IN_PROGRESS: 'In-Progress',
  USER_FLAG: 'User-Flag',
  ROOT_FLAG: 'Root-Flag'
};

exports.BOX_DIFFICULTIES = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
  INSANE: 'Insane'
};

exports.BOX_CATEGORIES = {
  RED: 'Red',
  BLUE: 'Blue',
  PURPLE: 'Purple'
};

exports.BOX_PLATFORMS = {
  HTB: 'HackTheBox',
  THM: 'TryHackMe',
  ROOT_ME: 'Root-Me',
  VULNHUB: 'VulnHub',
  OTHER: 'Other'
};

exports.TARGET_STATUSES = {
  DISCOVERY: 'Discovery',
  SCANNING: 'Scanning',
  VULNERABLE: 'Vulnerable',
  COMPROMISED: 'Compromised',
  PATCHED: 'Patched'
};

exports.TARGET_OS = {
  WINDOWS: 'Windows',
  LINUX: 'Linux',
  MACOS: 'MacOS',
  ANDROID: 'Android',
  IOS: 'iOS',
  UNKNOWN: 'Unknown'
};

exports.IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;