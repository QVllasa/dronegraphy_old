import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, EventEmitter, Injectable, OnInit, Output} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';
import {CategoryService} from "../../services/category.service";
import {map, mergeMap} from "rxjs/operators";

/**
 * Node for to-do item
 */
export class ChildCategory {
    children: ChildCategory[];
    value: string;
}

/** Flat to-do item node with expandable and level information */
export class ParentCategory {
    value: string;
    level: number;
    expandable: boolean;
}

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {

    //TODO use Objects instead of lists of strings
    tree_data: { [key: string]: any } = {};

    dataChange = new BehaviorSubject<ChildCategory[]>([]);

    get data(): ChildCategory[] {
        return this.dataChange.value;
    }

    constructor(private categoryService: CategoryService) {
        this.initialize();
    }


    initialize() {
        this.categoryService.getParentCategories().pipe(
            mergeMap(parents => {
                return this.categoryService.getChildCategories()
                    .pipe(
                        map(childs => {
                            // console.log(parents);
                            // console.log(childs);
                            this.tree_data = {}
                            for (let p of parents) {
                                this.tree_data[p.value] = []
                                for (let c of childs) {
                                    if (c.parent_category.value === p.value) {
                                        this.tree_data[p.value].push(c.value)
                                    }
                                }
                            }
                            // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
                            //     file node as children.
                            const data = this.buildFileTree(this.tree_data, 0);

                            // Notify the change.
                            this.dataChange.next(data);
                        })
                    )
            })
        ).subscribe()

    }

    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `TodoItemNode`.
     */
    buildFileTree(obj: { [key: string]: any }, level: number): ChildCategory[] {
        return Object.keys(obj).reduce<ChildCategory[]>((accumulator, key) => {
            const value = obj[key];
            const node = new ChildCategory();
            node.value = key;

            if (value != null) {
                if (typeof value === 'object') {
                    node.children = this.buildFileTree(value, level + 1);
                } else {
                    node.value = value;
                }
            }

            return accumulator.concat(node);
        }, []);
    }

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

    @Output() selected: EventEmitter<ParentCategory[]> = new EventEmitter<ParentCategory[]>();

    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    flatNodeMap = new Map<ParentCategory, ChildCategory>();

    /** Map from nested node to flattened node. This helps us to keep the same object for selection */
    nestedNodeMap = new Map<ChildCategory, ParentCategory>();

    /** A selected parent node to be inserted */
    selectedParent: ParentCategory | null = null;

    /** The new item's name */
    newItemName = '';

    treeControl: FlatTreeControl<ParentCategory>;

    treeFlattener: MatTreeFlattener<ChildCategory, ParentCategory>;

    dataSource: MatTreeFlatDataSource<ChildCategory, ParentCategory>;

    /** The selection for checklist */
    checklistSelection = new SelectionModel<ParentCategory>(true /* multiple */);

    constructor(private _database: ChecklistDatabase) {
        this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
            this.isExpandable, this.getChildren);
        this.treeControl = new FlatTreeControl<ParentCategory>(this.getLevel, this.isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

        _database.dataChange.subscribe(data => {
            this.dataSource.data = data;
        });
    }

    ngOnInit() {
    }

    getLevel = (node: ParentCategory) => node.level;

    isExpandable = (node: ParentCategory) => node.expandable;

    getChildren = (node: ChildCategory): ChildCategory[] => node.children;

    hasChild = (_: number, _nodeData: ParentCategory) => _nodeData.expandable;

    hasNoContent = (_: number, _nodeData: ParentCategory) => _nodeData.value === '';

    /**
     * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
     */
    transformer = (node: ChildCategory, level: number) => {
        const existingNode = this.nestedNodeMap.get(node);
        const flatNode = existingNode && existingNode.value === node.value
            ? existingNode
            : new ParentCategory();
        flatNode.value = node.value;
        flatNode.level = level;
        flatNode.expandable = !!node.children?.length;
        this.flatNodeMap.set(flatNode, node);
        this.nestedNodeMap.set(node, flatNode);
        return flatNode;
    }

    /** Whether all the descendants of the node are selected. */
    descendantsAllSelected(node: ParentCategory): boolean {
        const descendants = this.treeControl.getDescendants(node);
        return descendants.length > 0 && descendants.every(child => {
            return this.checklistSelection.isSelected(child);
        });
    }

    /** Whether part of the descendants are selected */
    descendantsPartiallySelected(node: ParentCategory): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.checklistSelection.isSelected(child));
        return result && !this.descendantsAllSelected(node);

    }

    /** Toggle the to-do item selection. Select/deselect all the descendants node */
    todoItemSelectionToggle(node: ParentCategory): void {
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
    todoLeafItemSelectionToggle(node: ParentCategory): void {
        this.checklistSelection.toggle(node);
        this.checkAllParentsSelection(node);
        this.selected.emit(this.checklistSelection.selected)
    }

    /* Checks all the parents when a leaf node is selected/unselected */
    checkAllParentsSelection(node: ParentCategory): void {
        let parent: ParentCategory | null = this.getParentNode(node);
        while (parent) {
            this.checkRootNodeSelection(parent);
            parent = this.getParentNode(parent);
        }
    }

    /** Check root node checked state and change it accordingly */
    checkRootNodeSelection(node: ParentCategory): void {
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

    /* Get the parent node of a node */
    getParentNode(node: ParentCategory): ParentCategory | null {
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


