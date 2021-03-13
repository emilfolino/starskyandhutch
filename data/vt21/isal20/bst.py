#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Kmom06
Binary Search Tree.
"""
from node import Node


class BinarySearchTree:
    """ Binary Search Tree object. """

    def __init__(self):
        """ Initialize object ."""
        self.root = None

    def insert(self, key, value):
        """ Insert new node with key and value. """

        if self.root is None:
            self.root = Node(key, value)
        self._insert(key, value, self.root)

    @classmethod
    def _insert(cls, key, value, node):
        """ Private insert method. (recursion) """
        # if node.key < key
        if key < node:
            # if node.left is not None
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
        """ Print nodes in order. lowest value to highest value. """
        self._print_nodes(self.root)

    @classmethod
    def _print_nodes(cls, node):
        if node is None:
            return
        if node.has_left_child():
            cls._print_nodes(node.left)
        print(node.value)
        if node.has_right_child():
            cls._print_nodes(node.right)

    def get(self, key):
        """ Get node with key. """
        if self.root is None:
            raise KeyError
        return self._get(key, self.root).value

    @classmethod
    def _get(cls, key, node):
        """ return node with key. """

        if node is None:
            raise KeyError

        if key < node:
            return cls._get(key, node.left)
        elif key > node:
            return cls._get(key, node.right)
        return node

    def remove(self, key):
        """ Reemove node at key. """

        if self.root is None:
            raise KeyError
        remove_ = self._get(key, self.root)
        return_ = self._remove(remove_)
        return return_

    def _remove(self, node):
        """ Private Remove method. """

        node_to_return = node.value
        if node.is_leaf():
            self.remove_leaf(node)

        elif node.has_both_children():
            successor = self._find_successor(node.right)
            node.key = successor.key
            node.value = successor.value

            if successor.is_left_child():
                successor.parent.left = successor.right
            else:
                successor.parent.right = successor.right

        elif node.has_left_child():
            self.remove_left_child(node)

        elif node.has_right_child():
            self.remove_right_child(node)

        return node_to_return

    def remove_leaf(self, node):
        """ Remove node that has no children. """
        if node == self.root:
            self.root = None
        elif node.is_left_child():
            node.parent.left = None
        else:
            node.parent.right = None

    def remove_left_child(self, node):
        """ Remove left child. """

        if node.has_parent():
            if node.is_left_child():
                node.parent.left = node.left.parent
            else:
                node.parent.right = node.left.parent
        else:
            self.root = node.left.parent

    def remove_right_child(self, node):
        """ Remove right child. """

        if node.has_parent():
            if node.is_left_child():
                node.parent.left = node.right.parent
            else:
                node.parent.right = node.right.parent
        else:
            self.root = node.right.parent

    @classmethod
    def _find_successor(cls, successor):
        """
        Find successor node.
        """
        if successor.left is None:
            return successor

        return cls._find_successor(successor.left)

    # def num__of_children(self, node):
    #     num = 0
    #     if node.left is not None:
    #         num += 1
    #     if node.right is not None:
    #         num += 1
    #     return num
