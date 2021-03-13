"""binary search tree"""
from node import Node
# import treevizer
class BinarySearchTree():
    """
    bst class
    """
    counter = 0
    def __init__(self):
        self.root = None

    def insert(self, key, value):
        """
        insert into bst
        """
        if self.root is None:
            self.root = Node(key, value)
        self._insert(key, value, self.root)


    @classmethod
    def _insert(cls, key, value, node):
        """
        insert recursive
        """
        if key < node:
            if node.has_left_child():
                cls._insert(key, value, node.left)
            else:
                node.left = Node(key, value, node)
        elif key > node:
            if node.has_right_child():
                cls._insert(key, value, node.right)
            else:
                node.right = Node(key, value, node)
        else:
            node.value = value

    def inorder_traversal_print(self):
        """
        inorder traversal print
        """
        self._print_nodes(self.root)

    @classmethod
    def _print_nodes(cls, node):
        """
        inorder traversal print recursive
        """
        if node is None:
            return
        if node.has_left_child():
            cls._print_nodes(node.left)

        print(node.value)

        if node.has_right_child():
            cls._print_nodes(node.right)

    def get(self, key):
        """
        use the key to get the value
        """

        if self.root is None:
            raise KeyError
        this = self._get(key, self.root)
        return this.value

    @classmethod
    def _get(cls, key, node):
        """
        recursive function for get
        """
        return_node = None
        if node is None:
            raise KeyError
        if key == node.key:
            return node
        # else:
        if key < node.key and node.has_left_child():
            return_node = node.left
            # return cls._get(key, node.left)
        elif key > node.key and node.has_right_child():
            return_node = node.right
        return cls._get(key, return_node)
        # raise KeyError

    @classmethod
    def succnode(cls, node):
        """
        finds the successor node
        """
        if node.left is None:
            return node
        return cls.succnode(node.left)

    def remove(self, key):
        """
        removes from tree
        """
        #löv
        #ett barn
        #två barn
        # if self.key == key:
        node = self._get(key, self.root)

        if node is None:
            raise KeyError

        if node.is_leaf():
            if node.parent is None:
                value = node.value
                node = None
                self.root = None
            elif node.key < node.parent.key:
                node.parent.left = None
                node.parent = None
                value = node.value
            else:
                node.parent.right = None
                node.parent = None
                value = node.value
            # treevizer.to_png(self.root, png_path=f"aaaaaaaaa{BinarySearchTree.counter}.png")
            # BinarySearchTree.counter += 1
            # return value
        elif node.has_both_child():
            #find successor node
            succnode = self.succnode(node.right)
            delnode = node.value
            node.key = succnode.key
            node.value = succnode.value
            succnode.parent.left = succnode.right
            # succNode.parent.right = succNode.right
            # succNode.right.parent = succNode.parent
            succnode.parent = node.parent
            # treevizer.to_png(self.root, png_path=f"aaaaaaaaa{BinarySearchTree.counter}.png")
            BinarySearchTree.counter += 1
            value = delnode
            # return delnode

        elif node.has_left_child() or node.has_right_child():
            # if node.has_left_child():
                # if node.parent is None:
                    # return None
                    # pass
            lef_child = node.has_left_child
            rig_child = node.has_right_child
            if node.parent is None:
                node.right.parent = None
                self.root = node.right
                node.right = node.parent
            elif lef_child and node.left.key < node.parent.key and node.parent is not None:
                node.parent.left = node.left
                node.left.parent = node.parent
            elif lef_child and node.left.key > node.parent.key and node.parent is not None:
                node.parent.right = node.right
                node.right.parent = node.parent
            # elif node.has_right_child() and node.parent is not None:
                # if node.parent is None:
                #     node.right.parent = None
                #     self.root = node.right
                    # node.right = node.parent
            if rig_child and node.right.key < node.parent.key and node.parent is not None:
                node.parent.left = node.right
                node.right.parent = node.parent
            elif rig_child and node.right.key > node.parent.key and node.parent is not None:
                node.parent.right = node.left
                node.right.paren = node.parent

            # treevizer.to_png(self.root, png_path=f"aaaaaaaaa{BinarySearchTree.counter}.png")
            BinarySearchTree.counter += 1
            value = node.value
        return value

        # raise KeyError
if __name__ == "__main__":
    bst = BinarySearchTree()
    # bst.insert(11, "first")

    # bst.insert(6, "second")

    # bst.insert(5, "third")

    # bst.insert(15, "fourth")

    # bst.insert(13, "fifth")
    # bst.insert(20, "sixth")
    # bst.insert(8, "seventh")
    # bst.insert(7, "eight")
    # [1, 5, 2, 4, 3, 0, 9, 7, 8, 6]
    bst.insert(1, "a")
    bst.insert(5, "b")
    bst.insert(2, "c")
    bst.insert(4, "d")
    bst.insert(3, "e")
    bst.insert(0, "f")
    bst.insert(9, "g")
    bst.insert(7, "h")
    bst.insert(8, "i")
    bst.insert(6, "j")
    # treevizer.to_png(bst.root, png_path="test1.png")
    # tjos = bst.get(11)
    # print(tjos)
    # thing = bst.get(6)
    # print(thing)
    # thing = bst.get(5)
    # print(thing)
    # thing = bst.get(15)
    # print(thing)
    bst.remove(1)
    bst.inorder_traversal_print()
    # treevizer.to_png(bst.root, png_path="test2.png")
