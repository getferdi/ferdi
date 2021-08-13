import Request from '../../stores/lib/Request';
import apiBase from '../../api/apiBase';
import { GITHUB_FERDI_REPO_NAME, GITHUB_NIGHTLIES_REPO_NAME, GITHUB_ORG_NAME } from '../../config';
import { ferdiVersion } from '../../environment';

const debug = require('debug')('Ferdi:feature:announcements:api');

export const announcementsApi = {
  async getCurrentVersion() {
    debug('getting current version of electron app');
    return Promise.resolve(ferdiVersion);
  },

  async getChangelog(version) {
    const ferdiRepoName = version.includes('nightly') ? GITHUB_NIGHTLIES_REPO_NAME : GITHUB_FERDI_REPO_NAME;
    const url = `https://api.github.com/repos/${GITHUB_ORG_NAME}/${ferdiRepoName}/releases/tags/v${version}`;
    debug(`fetching release changelog from Github url: ${url}`);
    const request = await window.fetch(url, { method: 'GET' });
    if (!request.ok) return null;
    const data = await request.json();
    return data.body;
  },

  async getAnnouncement(version) {
    const url = `${apiBase()}/announcements/${version}`;
    debug(`fetching release announcement from api url: ${url}`);
    const response = await window.fetch(url, { method: 'GET' });
    if (!response.ok) return null;
    return response.json();
  },
};

export const getCurrentVersionRequest = new Request(announcementsApi, 'getCurrentVersion');
export const getChangelogRequest = new Request(announcementsApi, 'getChangelog');
export const getAnnouncementRequest = new Request(announcementsApi, 'getAnnouncement');
