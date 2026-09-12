/* eslint-disable import/no-extraneous-dependencies */
import { memo } from 'react';
import DropdownTreeSelect from 'react-dropdown-tree-select';
// import 'react-dropdown-tree-select/dist/styles.css';
import { FormControl, FormHelperText, FormLabel } from '@mui/material';

/* Local Imports */
import styles from './index.style';

/* Types/Interfaces */
/**
 * Interface for tree node structure
 *
 * @interface TreeNode
 * @property {string} label - display text for the node
 * @property {string} value - value for the node
 * @property {boolean} checked - whether node is selected
 * @property {boolean} expanded - whether node is expanded
 * @property {TreeNode[]} children - child nodes
 */
export interface TreeNode {
  label: string;
  value: string;
  checked?: boolean;
  expanded?: boolean;
  children?: TreeNode[];
}

/**
 * Interface for MultiLevelSelectInput props
 *
 * @interface MultiLevelSelectInputProps
 * @property {string} name - name for tree select
 * @property {string} label - label text for the tree select
 * @property {TreeNode[]} data - hierarchical data for the tree select
 * @property {func} onChange - function called when selection changes
 * @property {string} placeholder - placeholder text
 * @property {string} size - size for the form control
 * @property {boolean} disabled - whether component is disabled
 * @property {boolean} required - whether field is required
 * @property {boolean} error - contains error state
 * @property {string} helperText - helper text to display
 */
export interface MultiLevelSelectInputProps {
  name: string;
  label?: string;
  data: TreeNode[];
  onChange?: (currentNode: TreeNode, selectedNodes: TreeNode[]) => void;
  placeholder?: string;
  size?: 'small' | 'medium';
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

// Helper to check if a node is a leaf node
const isLeafNode = (node: TreeNode): boolean => {
  return !node.children || node.children.length === 0;
};

// Modified to properly collect all leaf node IDs
export const getAllChildIds = (node: TreeNode): number[] => {
  let ids: number[] = [];

  if (isLeafNode(node)) {
    // If it's a leaf node, add its ID
    ids.push(parseInt(node.value, 10));
  } else if (node.children) {
    // If it has children, recursively collect their IDs
    node.children.forEach((child) => {
      ids = [...ids, ...getAllChildIds(child)];
    });
  }

  return ids;
};

// Modified to only collect leaf node IDs
export const getAllSelectedIds = (nodes: TreeNode[]): number[] => {
  let ids: number[] = [];

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const processNode = (node: TreeNode) => {
    if (node.checked) {
      if (isLeafNode(node)) {
        // If it's a checked leaf node, add its ID
        ids.push(parseInt(node.value, 10));
      } else if (node.children) {
        // If it's a checked parent, add all its leaf children's IDs
        node.children.forEach((child) => {
          ids = [...ids, ...getAllChildIds(child)];
        });
      }
    }

    // Even if parent is not checked, process children for partial selections
    if (node.children) {
      node.children.forEach(processNode);
    }
  };

  nodes.forEach(processNode);
  return Array.from(new Set(ids)); // Remove duplicates
};

export const updateNodeSelectionState = (
  nodes: TreeNode[],
  targetValue: string,
  newCheckedState?: boolean
): TreeNode[] => {
  return nodes.map((node) => {
    if (node.value === targetValue) {
      const isChecked = newCheckedState ?? !node.checked;

      // Update all descendants
      const updateDescendants = (n: TreeNode): TreeNode => {
        const updatedChildren = n.children?.map((child) =>
          updateDescendants({
            ...child,
            checked: isChecked
          })
        );

        return {
          ...n,
          checked: isChecked,
          children: updatedChildren
        };
      };

      return updateDescendants(node);
    }

    if (node.children) {
      const updatedChildren = updateNodeSelectionState(
        node.children,
        targetValue,
        newCheckedState
      );

      // Update parent state based on children
      const allChildrenChecked = updatedChildren.every(
        (child) => child.checked
      );
      const someChildrenChecked = updatedChildren.some(
        (child) => child.checked
      );

      return {
        ...node,
        children: updatedChildren,
        checked: allChildrenChecked,
        partiallyChecked: someChildrenChecked && !allChildrenChecked
      };
    }

    return node;
  });
};

/**
 * Multi-level tree select dropdown component
 */
const MultiLevelSelectInput = ({
  name,
  label = '',
  data,
  onChange = () => {},
  placeholder = 'Select...',
  size = 'small',
  disabled = false,
  required = false,
  error = false,
  helperText = ''
}: MultiLevelSelectInputProps): JSX.Element => {
  return (
    <FormControl
      fullWidth
      variant="standard"
      size={size}
      required={required}
      error={error}
      sx={styles.formControlStyle}
    >
      {label && <FormLabel sx={styles.formLabelStyle}>{label}</FormLabel>}
      <DropdownTreeSelect
        id={name}
        data={data}
        onChange={(currentNode, selectedNodes) => {
          // Get only leaf node IDs from the selection
          const selectedModuleIds = getAllSelectedIds(selectedNodes);
          // Call the parent onChange with both the current node and selected nodes
          onChange(currentNode, selectedNodes);

          // For debugging
          console.log('Current Node:', currentNode);
          console.log('Selected Nodes:', selectedNodes);
          console.log('Selected Module IDs:', selectedModuleIds);
        }}
        className={`mdl-tree-select ${error ? 'error' : ''}`}
        disabled={disabled}
        texts={{ placeholder }}
        showPartiallySelected
        keepTreeOnSearch
        keepChildrenOnSearch
        mode="multiSelect"
      />
      {error && helperText && (
        <FormHelperText sx={styles.formHelperTextStyle}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default memo(MultiLevelSelectInput);
