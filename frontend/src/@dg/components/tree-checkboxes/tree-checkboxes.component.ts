import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl, NestedTreeControl} from '@angular/cdk/tree';
import {Component, EventEmitter, Injectable, OnInit, Output} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';
import {CategoryService} from "../../services/category.service";
import {SearchService} from "../../services/search.service";
import {ICategory} from "../../models/category.model";


/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {

    //TODO use Objects instead of lists of strings in order to use IDs


    dataChange = new BehaviorSubject<ICategory[]>([]);

    get data(): ICategory[] {
        return this.dataChange.value;
    }

    constructor(private categoryService: CategoryService) {
        this.initialize();
    }


    initialize() {
        this.categoryService.getCategories()
            .subscribe(data => {
                console.log(data)
                this.dataChange.next(data);
            })

    }

    // /**
    //  * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
    //  * The return value is the list of `TodoItemNode`.
    //  */
    // buildFileTree(obj: { [key: string]: any }, level: number): ICategory[] {
    //     return Object.keys(obj).reduce<ChildCategory[]>((accumulator, key) => {
    //         const value = obj[key];
    //         const node = new ChildCategory();
    //         node.value = key;
    //
    //         if (value != null) {
    //             if (typeof value === 'object') {
    //                 node.children = this.buildFileTree(value, level + 1);
    //             } else {
    //                 node.value = value;
    //             }
    //         }
    //
    //         return accumulator.concat(node);
    //     }, []);
    // }

}

/**
 * @title Tree with checkboxes
 */
@Component({
    selector: 'tree-checkboxes',
    templateUrl: 'tree-checkboxes.component.html',
    styleUrls: ['tree-checkboxes.component.scss'],
    providers: [ChecklistDatabase]
})
export class TreeCheckboxesComponent implements OnInit {

    @Output() selected: EventEmitter<ICategory[]> = new EventEmitter<ICategory[]>();

    //new
    // treeControl = new NestedTreeControl<ICategory>(node => node.children);

    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    flatNodeMap = new Map<ICategory, ICategory>();

    /** Map from nested node to flattened node. This helps us to keep the same object for selection */
    nestedNodeMap = new Map<ICategory, ICategory>();

    /** A selected parent node to be inserted */
    selectedParent: ICategory | null = null;

    treeControl: FlatTreeControl<ICategory>;

    treeFlattener: MatTreeFlattener<ICategory, ICategory>;

    dataSource: MatTreeFlatDataSource<ICategory, ICategory>;

    /** The selection for checklist */
    checklistSelection = new SelectionModel<ICategory>(true /* multiple */);

    constructor(private _database: ChecklistDatabase, private searchService: SearchService) {
        this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
            this.isExpandable, this.getChildren);
        this.treeControl = new FlatTreeControl<ICategory>(this.getLevel, this.isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

        _database.dataChange.subscribe(data => {
            this.dataSource.data = data;
        });
    }

    ngOnInit() {
        this.searchService.valueChangesSubject.subscribe(params => {
            if (params.category.length > 0) {
                //    TODO check if is in category list
            }
        })
    }

    getLevel = (node: ICategory) => node.level;

    isExpandable = (node: ICategory) => node.expandable;

    getChildren = (node: ICategory): ICategory[] => node.children;

    hasChild = (_: number, _nodeData: ICategory) => _nodeData.expandable;

    // hasChild = (_: number, node: ICategory) => !!node.children && node.children.length > 0;


    /**
     * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
     */
    transformer = (node: ICategory, level: number) => {
        const existingNode = this.nestedNodeMap.get(node);
        const flatNode = existingNode && existingNode.value === node.value
            ? existingNode
            : new class implements ICategory {
                children: ICategory[];
                expandable: boolean;
                id: string;
                level: number;
                value: string;
            };
        flatNode.value = node.value;
        flatNode.level = level;
        flatNode.expandable = !!node.children?.length;
        this.flatNodeMap.set(flatNode, node);
        this.nestedNodeMap.set(node, flatNode);
        return flatNode;
    }

    /** Whether all the descendants of the node are selected. */
    descendantsAllSelected(node: ICategory): boolean {
        const descendants = this.treeControl.getDescendants(node);
        return descendants.length > 0 && descendants.every(child => {
            return this.checklistSelection.isSelected(child);
        });
    }

    /** Whether part of the descendants are selected */
    descendantsPartiallySelected(node: ICategory): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.checklistSelection.isSelected(child));
        return result && !this.descendantsAllSelected(node);

    }

    /** Toggle the to-do item selection. Select/deselect all the descendants node */
    todoItemSelectionToggle(node: ICategory): void {
        this.checklistSelection.toggle(node);
        const descendants = this.treeControl.getDescendants(node);
        this.checklistSelection.isSelected(node)
            ? this.checklistSelection.select(...descendants)
            : this.checklistSelection.deselect(...descendants);

        // Force update for the parent
        descendants.forEach(child => this.checklistSelection.isSelected(child));
        this.checkAllParentsSelection(node);
        this.selected.emit(this.checklistSelection.selected)
    }

    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    todoLeafItemSelectionToggle(node: ICategory): void {
        this.checklistSelection.toggle(node);
        this.checkAllParentsSelection(node);
        this.selected.emit(this.checklistSelection.selected)
    }

    /** Checks all the parents when a leaf node is selected/unselected */
    checkAllParentsSelection(node: ICategory): void {
        let parent: ICategory | null = this.getParentNode(node);
        while (parent) {
            this.checkRootNodeSelection(parent);
            parent = this.getParentNode(parent);
        }
    }

    /** Check root node checked state and change it accordingly */
    checkRootNodeSelection(node: ICategory): void {
        const nodeSelected = this.checklistSelection.isSelected(node);
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected = descendants.length > 0 && descendants.every(child => {
            return this.checklistSelection.isSelected(child);
        });
        if (nodeSelected && !descAllSelected) {
            this.checklistSelection.deselect(node);
        } else if (!nodeSelected && descAllSelected) {
            this.checklistSelection.select(node);
        }
    }

    /** Get the parent node of a node */
    getParentNode(node: ICategory): ICategory | null {
        const currentLevel = this.getLevel(node);

        if (currentLevel < 1) {
            return null;
        }

        const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

        for (let i = startIndex; i >= 0; i--) {
            const currentNode = this.treeControl.dataNodes[i];

            if (this.getLevel(currentNode) < currentLevel) {
                return currentNode;
            }
        }
        return null;
    }

}


