/* eslint-disable */
import { Writer, Reader } from 'protobufjs/minimal';
export const protobufPackage = 'clockworkgr.codegenui.blog';
const basePost = { creator: '', id: '', title: '', body: '', votes: 0 };
export const Post = {
    encode(message, writer = Writer.create()) {
        if (message.creator !== '') {
            writer.uint32(10).string(message.creator);
        }
        if (message.id !== '') {
            writer.uint32(18).string(message.id);
        }
        if (message.title !== '') {
            writer.uint32(26).string(message.title);
        }
        if (message.body !== '') {
            writer.uint32(34).string(message.body);
        }
        if (message.votes !== 0) {
            writer.uint32(40).int32(message.votes);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...basePost };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.creator = reader.string();
                    break;
                case 2:
                    message.id = reader.string();
                    break;
                case 3:
                    message.title = reader.string();
                    break;
                case 4:
                    message.body = reader.string();
                    break;
                case 5:
                    message.votes = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...basePost };
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = String(object.creator);
        }
        else {
            message.creator = '';
        }
        if (object.id !== undefined && object.id !== null) {
            message.id = String(object.id);
        }
        else {
            message.id = '';
        }
        if (object.title !== undefined && object.title !== null) {
            message.title = String(object.title);
        }
        else {
            message.title = '';
        }
        if (object.body !== undefined && object.body !== null) {
            message.body = String(object.body);
        }
        else {
            message.body = '';
        }
        if (object.votes !== undefined && object.votes !== null) {
            message.votes = Number(object.votes);
        }
        else {
            message.votes = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.creator !== undefined && (obj.creator = message.creator);
        message.id !== undefined && (obj.id = message.id);
        message.title !== undefined && (obj.title = message.title);
        message.body !== undefined && (obj.body = message.body);
        message.votes !== undefined && (obj.votes = message.votes);
        return obj;
    },
    fromPartial(object) {
        const message = { ...basePost };
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = object.creator;
        }
        else {
            message.creator = '';
        }
        if (object.id !== undefined && object.id !== null) {
            message.id = object.id;
        }
        else {
            message.id = '';
        }
        if (object.title !== undefined && object.title !== null) {
            message.title = object.title;
        }
        else {
            message.title = '';
        }
        if (object.body !== undefined && object.body !== null) {
            message.body = object.body;
        }
        else {
            message.body = '';
        }
        if (object.votes !== undefined && object.votes !== null) {
            message.votes = object.votes;
        }
        else {
            message.votes = 0;
        }
        return message;
    }
};
