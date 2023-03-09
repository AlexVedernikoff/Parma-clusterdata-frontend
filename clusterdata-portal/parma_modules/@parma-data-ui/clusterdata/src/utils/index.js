import {
    getNameByIndex,
    getPathBefore,
    getBeforeFolderName,
    normalizeDestination
} from '@parma-data-ui/common/src/components/Navigation/util';
import {PERMISSION} from '../constants/common';

export default class Utils {
    static getBeforeFolderName = getBeforeFolderName;
    static getNameByIndex = getNameByIndex;
    static getPathBefore = getPathBefore;
    static normalizeDestination = normalizeDestination;

    static emitBodyClick() {
        document.body.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    }

    static isEntryId(id) {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id);
    }

    static getEntryNameFromKey(key) {
        const match = key.match(/[^/]*$/);
        return match ? match[0] : key;
    }

    static getCookie(name) {
        const cookie = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return cookie ? cookie.pop() : '';
    }

    static setCookie({name, value, path = '/', maxAge = 365 * 24 * 60 * 60}) {
        document.cookie = `${name}=${value}; path=${path}; max-age=${maxAge}`;
    }

    static deleteCookie({name}) {
        if (name) {
            this.setCookie({name, value: '', maxAge: -1});
        }
    }

    static restore(key) {
        try {
            const data = window.localStorage.getItem(key);
            if (data === undefined) {
                return null;
            }
            return JSON.parse(data);
        } catch (err) {
            return null;
        }
    }

    static store(key, data) {
        try {
            window.localStorage.setItem(key, JSON.stringify(data));
        } catch (err) {
            console.error(`data not saved in localeStorage: ${err}`);
        }
    }

    static getTextByPermission(permission) {
        switch (permission) {
            case PERMISSION.READ: return 'Read';
            case PERMISSION.WRITE: return 'Write';
            case PERMISSION.ADMIN: return 'Admin';
            case PERMISSION.EXECUTE: return 'Execute';
            default: return undefined;
        }
    }

    static formParticipants({permissions}) {
        return Object.entries(permissions)
            .reduce((participants, [permission, participantsByPermission]) => {
                participantsByPermission.forEach(participantByPermission => {
                    const participantByPermissionFormatted = Object.entries(participantByPermission)
                        .reduce((reducer, [key, value]) => {
                            reducer[key] = [null, undefined].includes(value) ? {} : value;

                            return reducer;
                        }, {});

                    participants.push({
                        ...participantByPermissionFormatted,
                        permission
                    });
                });

                return participants;
            }, [])
            .sort((prev, next) => {
                if (prev.name > next.name) {
                    return 1;
                } else if (prev.name < next.name) {
                    return -1;
                } else {
                    return 0;
                }
            });
    }

    static removePermission({
        body = {diff: {added: {}, removed: {}}},
        permission,
        subject,
        comment = ''
    }) {
        return {
            ...body,
            diff: {
                ...body.diff,
                removed: {
                    ...body.diff.removed,
                    [permission]: [
                        ...(body.diff.removed[permission] || []),
                        {
                            subject,
                            comment
                        }
                    ]
                }
            }
        };
    }

    static modifyPermission({
        body = {diff: {added: {}, removed: {}, modified: {}}},
        newPermission,
        permission,
        subject,
        newSubject = subject,
        comment = ''
    }) {
        return {
            ...body,
            diff: {
                ...body.diff,
                modified: {
                    ...body.diff.modified,
                    [permission]: [
                        ...(body.diff.modified[permission] || []),
                        {
                            subject,
                            comment,
                            new: {
                                subject: newSubject,
                                grantType: newPermission
                            }
                        }
                    ]
                }
            }
        };
    }

    static addPermission({
        body = {diff: {added: {}, removed: {}}},
        permission = PERMISSION.READ,
        subject,
        comment = ''
    }) {
        return {
            ...body,
            diff: {
                ...body.diff,
                added: {
                    ...body.diff.added,
                    [permission]: [
                        ...(body.diff.added[permission] || []),
                        {
                            subject,
                            comment
                        }
                    ]
                }
            }
        };
    }

    static isRetina() {
        let devicePixelRatio = 1;
        if ('deviceXDPI' in window.screen && 'logicalXDPI' in window.screen) {
            devicePixelRatio = window.screen.deviceXDPI / window.screen.logicalXDPI;
        } else if ('devicePixelRatio' in window) {
            devicePixelRatio = window.devicePixelRatio;
        }
        return devicePixelRatio >= 1.3;
    }

    static setBodyFeatures() {
        const body = window.document.body;
        body.classList.add('yc-root', 'yc-root_theme_light');
        if (this.isRetina()) {
            body.classList.add('i-ua_retina_yes');
        }
    }

    static parseErrorResponse(error = {}) {
        const {
            response: {
                status,
                data: {
                    message: dataMessage
                } = {},
                headers: {
                    'x-request-id': requestId
                } = {}
            } = {},
            message
        } = error;
        return {status, requestId, message: dataMessage || message};
    }

    static getCSRFToken() {
        const csrfMetaTag = document.querySelector('meta[name=csrf-token]');
        return csrfMetaTag ? csrfMetaTag.content : null;
    }

    static isInternalInstallation() {
        return window.DL.installationType === 'internal';
    }
}
