import {ParmaRowInterface} from "./ParmaRow.interface";
import {ModeType, ScopeType} from "../../../../enums";
import {CallbackFunctionArgs, CallbackFunctionArgsReturnAny} from "../../../../helpers";

const NAVIGATION_ROOT_NAME = 'Все файлы';

export class ParmaRowModel implements ParmaRowInterface {
    constructor(value: ParmaRowInterface) {
        this.iconEntry = value.iconEntry;
        this.iconFavoriteFilled = value.iconFavoriteFilled;
        this.iconFavoriteEmpty = value.iconDots;
        this.iconFolderInline = value.iconFolderInline;

        this.clickableScope = value.clickableScope;
        this.displayParentFolder = value.displayParentFolder;
        this.entry = value.entry;
        this.isActive = value.isActive;
        this.linkWrapper = value.linkWrapper;
        this.mode = value.mode;
        this.onChangeFavorite = value.onChangeFavorite;
        this.onEntryContextClick = value.onEntryContextClick;
        this.onEntryClick = value.onEntryClick;
        this.onEntryParentClick = value.onEntryParentClick;
    }

    iconEntry: any
    iconFavoriteFilled: any
    iconFavoriteEmpty: any
    iconDots: any
    iconFolderInline: any

    clickableScope: ScopeType;
    displayParentFolder: boolean;
    entry: any;
    isActive: boolean;
    linkWrapper: CallbackFunctionArgsReturnAny;
    mode: ModeType;
    onChangeFavorite: CallbackFunctionArgs;
    onEntryClick: CallbackFunctionArgs;
    onEntryContextClick: CallbackFunctionArgs;
    onEntryParentClick?: CallbackFunctionArgs;

    getParentFolderEntry(entry: any) {
        const path = this.getPathBefore(entry.key)
        return {
            scope: ScopeType.folder,
            key: path[0],
            name: path[1],
            parent: true,
        }
    }

    /**
     * Получает путь до текущей папки и название папки-родителя
     * @param path - полный путь, включая имя текущей папки
     */
    getPathBefore(path: string) {
        let pathBefore = '/';
        let name = '/';

        if (path) {
            let pathSplit = path.split('/');
            pathSplit = pathSplit.filter(nameStr => nameStr);
            pathSplit.splice(-1, 1);

            if (pathSplit.length !== 0) {
                pathBefore = pathSplit.join('/');
                name = pathSplit[pathSplit.length - 1];
            }
        }

        pathBefore = pathBefore === '/' ? '/' : pathBefore + '/';
        name = name === '/' ? NAVIGATION_ROOT_NAME : name;

        return [pathBefore, name];
    }

    isEntryActive(scope: ScopeType, clickableScope: ScopeType) {
        if (clickableScope) {
            return scope === ScopeType.folder || clickableScope === scope;
        }
        return true;
    }
}