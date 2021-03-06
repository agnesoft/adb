// Copyright 2021 Agnesoft
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// GENERATED FILE. DO NOT MODIFY.

module;

#include <cstdint>
#include <memory>
#include <string>
#include <variant>
#include <vector>

export module adbquery;

namespace adb
{
//--------//
//In built//
//--------//
using Byte = std::uint8_t;
using ByteArray = std::vector<Byte>;
using Buffer = ByteArray;
using Double = double;
using Int64 = std::int64_t;
using i = Int64;
using Index = Int64;
using Offset = Int64;
using String = std::string;

auto deserializeDouble(Buffer &buffer, Offset off) -> Double {
    return {};
}

auto deserializeInt64(Buffer &buffer, Offset off) -> Int64 {
    return {};
}

auto serializeDouble(Buffer &buffer, Offset off, Double value) -> void {

}

auto serializeInt64(Buffer &buffer, Offset off, Int64 value) -> void {

}

auto stringFromBuffer(Buffer &buffer) -> String {
    return {};
}

auto stringToBuffer(String &buffer) -> Buffer {
    return {};
}

auto int64ToLittleEndian(Int64 value) -> Int64 {
    return {};
}

auto doubleToLittleEndian(Double value) -> Double {
    return {};
}

auto int64ToNativeEndian(Int64 value) -> Int64 {
    return {};
}

auto doubleToNativeEndian(Double value) -> Double {
    return {};
}

//------------//
//User Defined//
//------------//
class Query;

using Count = Int64;
using Distance = Int64;
using Id = Int64;
using Ids = std::vector<Id>;
using FromId = Id;
using FromIds = Ids;
using ToId = Id;
using ToIds = Ids;
using Value = std::variant<Int64, Double, String>;
using Key = Value;
using Keys = std::vector<Key>;

class KeyValue
{
public:
    KeyValue(Key key_, Value value_) :
        mKey{std::move(key_)},
        mValue{std::move(value_)}
    {
    }

private:
    Key mKey;
    Value mValue;
};
using KeyValues = std::vector<KeyValue>;
using Placeholder = String;
using IdField = std::variant<Id, Placeholder, std::unique_ptr<Query>>;
using IdsField = std::variant<Ids, Placeholder, std::unique_ptr<Query>>;
using FromIdField = std::variant<FromId, Placeholder, std::unique_ptr<Query>>;
using FromIdsField = std::variant<FromIds, Placeholder, std::unique_ptr<Query>>;
using ToIdField = std::variant<ToId, Placeholder, std::unique_ptr<Query>>;
using ToIdsField = std::variant<ToIds, Placeholder, std::unique_ptr<Query>>;
using KeyField = std::variant<Key, Placeholder, std::unique_ptr<Query>>;
using KeysField = std::variant<Keys, Placeholder, std::unique_ptr<Query>>;
using CountField = std::variant<Count, Placeholder, std::unique_ptr<Query>>;
using ValueField = std::variant<Key, Placeholder, std::unique_ptr<Query>>;
using ElementsDataField = std::variant<KeyValues, Placeholder, std::unique_ptr<Query>>;

class Element
{
public:
    Element(Id id_, KeyValues keyValues_) :
        mId{std::move(id_)},
        mKeyValues{std::move(keyValues_)}
    {
    }

private:
    Id mId;
    KeyValues mKeyValues;
};
using Elements = std::vector<Element>;

class EqualsCount
{
public:
    explicit EqualsCount(CountField countField_) :
        mCountField{std::move(countField_)}
    {
    }

private:
    CountField mCountField;
};

class NotEqualsCount
{
public:
    explicit NotEqualsCount(CountField countField_) :
        mCountField{std::move(countField_)}
    {
    }

private:
    CountField mCountField;
};

class LessThanCount
{
public:
    explicit LessThanCount(CountField countField_) :
        mCountField{std::move(countField_)}
    {
    }

private:
    CountField mCountField;
};

class LessThanOrEqualCount
{
public:
    explicit LessThanOrEqualCount(CountField countField_) :
        mCountField{std::move(countField_)}
    {
    }

private:
    CountField mCountField;
};

class GreaterThanCount
{
public:
    explicit GreaterThanCount(CountField countField_) :
        mCountField{std::move(countField_)}
    {
    }

private:
    CountField mCountField;
};

class GreaterThanOrEqualCount
{
public:
    explicit GreaterThanOrEqualCount(CountField countField_) :
        mCountField{std::move(countField_)}
    {
    }

private:
    CountField mCountField;
};
using CountCompare = std::variant<EqualsCount, NotEqualsCount, LessThanCount, LessThanOrEqualCount, GreaterThanCount, GreaterThanOrEqualCount>;

class EqualsValue
{
public:
    explicit EqualsValue(ValueField valueField_) :
        mValueField{std::move(valueField_)}
    {
    }

private:
    ValueField mValueField;
};

class NotEqualsValue
{
public:
    explicit NotEqualsValue(ValueField valueField_) :
        mValueField{std::move(valueField_)}
    {
    }

private:
    ValueField mValueField;
};

class LessThanValue
{
public:
    explicit LessThanValue(ValueField valueField_) :
        mValueField{std::move(valueField_)}
    {
    }

private:
    ValueField mValueField;
};

class LessThanOrEqualValue
{
public:
    explicit LessThanOrEqualValue(ValueField valueField_) :
        mValueField{std::move(valueField_)}
    {
    }

private:
    ValueField mValueField;
};

class GreaterThanValue
{
public:
    explicit GreaterThanValue(ValueField valueField_) :
        mValueField{std::move(valueField_)}
    {
    }

private:
    ValueField mValueField;
};

class GreaterThanOrEqualValue
{
public:
    explicit GreaterThanOrEqualValue(ValueField valueField_) :
        mValueField{std::move(valueField_)}
    {
    }

private:
    ValueField mValueField;
};
using ValueCompare = std::variant<EqualsValue, NotEqualsValue, LessThanValue, LessThanOrEqualValue, GreaterThanValue, GreaterThanOrEqualValue>;

class WhereCondition
{
public:
    WhereCondition()
    {
    }

private:

};

class AndCondition
{
public:
    AndCondition()
    {
    }

private:

};

class OrCondition
{
public:
    OrCondition()
    {
    }

private:

};

class EndWhereCondition
{
public:
    EndWhereCondition()
    {
    }

private:

};

class CountCondition
{
public:
    explicit CountCondition(CountCompare countCompare_) :
        mCountCompare{std::move(countCompare_)}
    {
    }

private:
    CountCompare mCountCompare;
};

class EdgeCountCondition
{
public:
    explicit EdgeCountCondition(CountCompare countCompare_) :
        mCountCompare{std::move(countCompare_)}
    {
    }

private:
    CountCompare mCountCompare;
};

class FromCountCondition
{
public:
    explicit FromCountCondition(CountCompare countCompare_) :
        mCountCompare{std::move(countCompare_)}
    {
    }

private:
    CountCompare mCountCompare;
};

class ToCountCondition
{
public:
    explicit ToCountCondition(CountCompare countCompare_) :
        mCountCompare{std::move(countCompare_)}
    {
    }

private:
    CountCompare mCountCompare;
};

class DistanceCondition
{
public:
    explicit DistanceCondition(CountCompare countCompare_) :
        mCountCompare{std::move(countCompare_)}
    {
    }

private:
    CountCompare mCountCompare;
};

class NotBeyondIdsCondition
{
public:
    explicit NotBeyondIdsCondition(IdsField idsField_) :
        mIdsField{std::move(idsField_)}
    {
    }

private:
    IdsField mIdsField;
};

class NotIdsCondition
{
public:
    explicit NotIdsCondition(IdsField idsField_) :
        mIdsField{std::move(idsField_)}
    {
    }

private:
    IdsField mIdsField;
};

class EdgeCondition
{
public:
    EdgeCondition()
    {
    }

private:

};

class NodeCondition
{
public:
    NodeCondition()
    {
    }

private:

};

class KeysCondition
{
public:
    explicit KeysCondition(KeysField keysField_) :
        mKeysField{std::move(keysField_)}
    {
    }

private:
    KeysField mKeysField;
};

class NotKeysCondition
{
public:
    explicit NotKeysCondition(KeysField keysField_) :
        mKeysField{std::move(keysField_)}
    {
    }

private:
    KeysField mKeysField;
};

class ValueCondition
{
public:
    ValueCondition(KeyField keyField_, ValueCompare valueCompare_) :
        mKeyField{std::move(keyField_)},
        mValueCompare{std::move(valueCompare_)}
    {
    }

private:
    KeyField mKeyField;
    ValueCompare mValueCompare;
};
using Condition = std::variant<WhereCondition, AndCondition, OrCondition, EndWhereCondition, CountCondition, EdgeCountCondition, FromCountCondition, ToCountCondition, DistanceCondition, NotBeyondIdsCondition, NotIdsCondition, EdgeCondition, NodeCondition, KeysCondition, NotKeysCondition, ValueCondition>;
using Conditions = std::vector<Condition>;

class InsertNodesQueryData
{
public:
    InsertNodesQueryData(CountField countField_, ElementsDataField elementsDataField_) :
        mCountField{std::move(countField_)},
        mElementsDataField{std::move(elementsDataField_)}
    {
    }

private:
    CountField mCountField;
    ElementsDataField mElementsDataField;
};

class InsertEdgesQueryData
{
public:
    InsertEdgesQueryData(CountField countField_, FromIdsField fromIdsField_, ToIdsField toIdsField_, ElementsDataField elementsDataField_) :
        mCountField{std::move(countField_)},
        mFromIdsField{std::move(fromIdsField_)},
        mToIdsField{std::move(toIdsField_)},
        mElementsDataField{std::move(elementsDataField_)}
    {
    }

private:
    CountField mCountField;
    FromIdsField mFromIdsField;
    ToIdsField mToIdsField;
    ElementsDataField mElementsDataField;
};

class InsertEdgesEachQueryData
{
public:
    InsertEdgesEachQueryData(CountField countField_, FromIdsField fromIdsField_, ToIdsField toIdsField_, ElementsDataField elementsDataField_) :
        mCountField{std::move(countField_)},
        mFromIdsField{std::move(fromIdsField_)},
        mToIdsField{std::move(toIdsField_)},
        mElementsDataField{std::move(elementsDataField_)}
    {
    }

private:
    CountField mCountField;
    FromIdsField mFromIdsField;
    ToIdsField mToIdsField;
    ElementsDataField mElementsDataField;
};

class InsertDataQueryData
{
public:
    InsertDataQueryData(IdsField idsField_, ElementsDataField elementsDataField_) :
        mIdsField{std::move(idsField_)},
        mElementsDataField{std::move(elementsDataField_)}
    {
    }

private:
    IdsField mIdsField;
    ElementsDataField mElementsDataField;
};

class RemoveQueryData
{
public:
    RemoveQueryData(IdsField idsField_, KeysField keysField_) :
        mIdsField{std::move(idsField_)},
        mKeysField{std::move(keysField_)}
    {
    }

private:
    IdsField mIdsField;
    KeysField mKeysField;
};

class SelectElementsQueryData
{
public:
    SelectElementsQueryData(IdsField idsField_, FromIdField fromIdField_, ToIdField toIdField_, KeysField keysField_, Conditions conditions_) :
        mIdsField{std::move(idsField_)},
        mFromIdField{std::move(fromIdField_)},
        mToIdField{std::move(toIdField_)},
        mKeysField{std::move(keysField_)},
        mConditions{std::move(conditions_)}
    {
    }

private:
    IdsField mIdsField;
    FromIdField mFromIdField;
    ToIdField mToIdField;
    KeysField mKeysField;
    Conditions mConditions;
};

class SelectIdsQueryData
{
public:
    SelectIdsQueryData(FromIdField fromIdField_, ToIdField toIdField_, Conditions conditions_) :
        mFromIdField{std::move(fromIdField_)},
        mToIdField{std::move(toIdField_)},
        mConditions{std::move(conditions_)}
    {
    }

private:
    FromIdField mFromIdField;
    ToIdField mToIdField;
    Conditions mConditions;
};

class SelectCountQueryData
{
public:
    SelectCountQueryData(FromIdField fromIdField_, ToIdField toIdField_, Conditions conditions_) :
        mFromIdField{std::move(fromIdField_)},
        mToIdField{std::move(toIdField_)},
        mConditions{std::move(conditions_)}
    {
    }

private:
    FromIdField mFromIdField;
    ToIdField mToIdField;
    Conditions mConditions;
};

class SelectKeyCountQueryData
{
public:
    SelectKeyCountQueryData(IdField idField_, Conditions conditions_) :
        mIdField{std::move(idField_)},
        mConditions{std::move(conditions_)}
    {
    }

private:
    IdField mIdField;
    Conditions mConditions;
};

class SelectPathElementsQuery
{
public:
    SelectPathElementsQuery(FromIdField fromIdField_, ToIdField toIdField_, KeysField keysField_, Conditions conditions_) :
        mFromIdField{std::move(fromIdField_)},
        mToIdField{std::move(toIdField_)},
        mKeysField{std::move(keysField_)},
        mConditions{std::move(conditions_)}
    {
    }

private:
    FromIdField mFromIdField;
    ToIdField mToIdField;
    KeysField mKeysField;
    Conditions mConditions;
};

class SelectPathIdsQuery
{
public:
    SelectPathIdsQuery(FromIdField fromIdField_, ToIdField toIdField_, Conditions conditions_) :
        mFromIdField{std::move(fromIdField_)},
        mToIdField{std::move(toIdField_)},
        mConditions{std::move(conditions_)}
    {
    }

private:
    FromIdField mFromIdField;
    ToIdField mToIdField;
    Conditions mConditions;
};
using QueryData = std::variant<InsertNodesQueryData, InsertEdgesQueryData, InsertEdgesEachQueryData, InsertDataQueryData, RemoveQueryData, SelectElementsQueryData, SelectIdsQueryData, SelectCountQueryData, SelectKeyCountQueryData, SelectPathElementsQuery, SelectPathIdsQuery>;

class Query
{
public:
    explicit Query(QueryData queryData_) :
        mQueryData{std::move(queryData_)}
    {
    }

private:
    QueryData mQueryData;
};

class Result
{
public:
    Result(Count count_, Elements elements_) :
        mCount{std::move(count_)},
        mElements{std::move(elements_)}
    {
    }

private:
    Count mCount;
    Elements mElements;
};

auto serialize_Byte(Buffer &buffer_, Offset &offset_, Byte byte_) -> void
{



}

auto deserialize_Byte(Buffer buffer_, Offset &offset_) -> Byte
{




}

auto serialize_Int64(Buffer &buffer_, Offset &offset_, Int64 int64_) -> void
{


}

auto deserialize_Int64(Buffer buffer_, Offset &offset_) -> Int64
{


}

auto serialize_Double(Buffer &buffer_, Offset &offset_, Double double_) -> void
{


}

auto deserialize_Double(Buffer buffer_, Offset &offset_) -> Double
{


}

auto serialize_String(Buffer buffer_, Offset offset_, String string_) -> void
{


}

auto deserialize_String(Buffer buffer_, Offset offset_) -> String
{


}

auto serialize_ByteArray(Buffer &buffer_, Offset &offset_, ByteArray byteArray_) -> void
{



}

auto deserialize_ByteArray(Buffer buffer_, Offset &offset_) -> ByteArray
{




}

auto serialize_Ids(Buffer &buffer_, Offset &offset_, Ids ids_) -> void
{



}

auto deserialize_Ids(Buffer buffer_, Offset &offset_) -> Ids
{




}

auto serialize_Value(Buffer &buffer_, Offset &offset_, Value value_) -> void
{






}

auto deserialize_Value(Buffer buffer_, Offset &offset_) -> Value
{






}

auto serialize_Keys(Buffer &buffer_, Offset &offset_, Keys keys_) -> void
{



}

auto deserialize_Keys(Buffer buffer_, Offset &offset_) -> Keys
{




}

auto serialize_KeyValue(Buffer &buffer_, Offset &offset_, KeyValue keyValue_) -> void
{



}

auto deserialize_KeyValue(Buffer buffer_, Offset &offset_) -> KeyValue
{


}

auto serialize_KeyValues(Buffer &buffer_, Offset &offset_, KeyValues keyValues_) -> void
{



}

auto deserialize_KeyValues(Buffer buffer_, Offset &offset_) -> KeyValues
{




}

auto serialize_IdField(Buffer &buffer_, Offset &offset_, IdField idField_) -> void
{






}

auto deserialize_IdField(Buffer buffer_, Offset &offset_) -> IdField
{






}

auto serialize_IdsField(Buffer &buffer_, Offset &offset_, IdsField idsField_) -> void
{






}

auto deserialize_IdsField(Buffer buffer_, Offset &offset_) -> IdsField
{






}

auto serialize_FromIdField(Buffer &buffer_, Offset &offset_, FromIdField fromIdField_) -> void
{






}

auto deserialize_FromIdField(Buffer buffer_, Offset &offset_) -> FromIdField
{






}

auto serialize_FromIdsField(Buffer &buffer_, Offset &offset_, FromIdsField fromIdsField_) -> void
{






}

auto deserialize_FromIdsField(Buffer buffer_, Offset &offset_) -> FromIdsField
{






}

auto serialize_ToIdField(Buffer &buffer_, Offset &offset_, ToIdField toIdField_) -> void
{






}

auto deserialize_ToIdField(Buffer buffer_, Offset &offset_) -> ToIdField
{






}

auto serialize_ToIdsField(Buffer &buffer_, Offset &offset_, ToIdsField toIdsField_) -> void
{






}

auto deserialize_ToIdsField(Buffer buffer_, Offset &offset_) -> ToIdsField
{






}

auto serialize_KeyField(Buffer &buffer_, Offset &offset_, KeyField keyField_) -> void
{






}

auto deserialize_KeyField(Buffer buffer_, Offset &offset_) -> KeyField
{






}

auto serialize_KeysField(Buffer &buffer_, Offset &offset_, KeysField keysField_) -> void
{






}

auto deserialize_KeysField(Buffer buffer_, Offset &offset_) -> KeysField
{






}

auto serialize_CountField(Buffer &buffer_, Offset &offset_, CountField countField_) -> void
{






}

auto deserialize_CountField(Buffer buffer_, Offset &offset_) -> CountField
{






}

auto serialize_ValueField(Buffer &buffer_, Offset &offset_, ValueField valueField_) -> void
{






}

auto deserialize_ValueField(Buffer buffer_, Offset &offset_) -> ValueField
{






}

auto serialize_ElementsDataField(Buffer &buffer_, Offset &offset_, ElementsDataField elementsDataField_) -> void
{






}

auto deserialize_ElementsDataField(Buffer buffer_, Offset &offset_) -> ElementsDataField
{






}

auto serialize_Element(Buffer &buffer_, Offset &offset_, Element element_) -> void
{



}

auto deserialize_Element(Buffer buffer_, Offset &offset_) -> Element
{


}

auto serialize_Elements(Buffer &buffer_, Offset &offset_, Elements elements_) -> void
{



}

auto deserialize_Elements(Buffer buffer_, Offset &offset_) -> Elements
{




}

auto serialize_EqualsCount(Buffer &buffer_, Offset &offset_, EqualsCount equalsCount_) -> void
{


}

auto deserialize_EqualsCount(Buffer buffer_, Offset &offset_) -> EqualsCount
{


}

auto serialize_NotEqualsCount(Buffer &buffer_, Offset &offset_, NotEqualsCount notEqualsCount_) -> void
{


}

auto deserialize_NotEqualsCount(Buffer buffer_, Offset &offset_) -> NotEqualsCount
{


}

auto serialize_LessThanCount(Buffer &buffer_, Offset &offset_, LessThanCount lessThanCount_) -> void
{


}

auto deserialize_LessThanCount(Buffer buffer_, Offset &offset_) -> LessThanCount
{


}

auto serialize_LessThanOrEqualCount(Buffer &buffer_, Offset &offset_, LessThanOrEqualCount lessThanOrEqualCount_) -> void
{


}

auto deserialize_LessThanOrEqualCount(Buffer buffer_, Offset &offset_) -> LessThanOrEqualCount
{


}

auto serialize_GreaterThanCount(Buffer &buffer_, Offset &offset_, GreaterThanCount greaterThanCount_) -> void
{


}

auto deserialize_GreaterThanCount(Buffer buffer_, Offset &offset_) -> GreaterThanCount
{


}

auto serialize_GreaterThanOrEqualCount(Buffer &buffer_, Offset &offset_, GreaterThanOrEqualCount greaterThanOrEqualCount_) -> void
{


}

auto deserialize_GreaterThanOrEqualCount(Buffer buffer_, Offset &offset_) -> GreaterThanOrEqualCount
{


}

auto serialize_CountCompare(Buffer &buffer_, Offset &offset_, CountCompare countCompare_) -> void
{









}

auto deserialize_CountCompare(Buffer buffer_, Offset &offset_) -> CountCompare
{









}

auto serialize_EqualsValue(Buffer &buffer_, Offset &offset_, EqualsValue equalsValue_) -> void
{


}

auto deserialize_EqualsValue(Buffer buffer_, Offset &offset_) -> EqualsValue
{


}

auto serialize_NotEqualsValue(Buffer &buffer_, Offset &offset_, NotEqualsValue notEqualsValue_) -> void
{


}

auto deserialize_NotEqualsValue(Buffer buffer_, Offset &offset_) -> NotEqualsValue
{


}

auto serialize_LessThanValue(Buffer &buffer_, Offset &offset_, LessThanValue lessThanValue_) -> void
{


}

auto deserialize_LessThanValue(Buffer buffer_, Offset &offset_) -> LessThanValue
{


}

auto serialize_LessThanOrEqualValue(Buffer &buffer_, Offset &offset_, LessThanOrEqualValue lessThanOrEqualValue_) -> void
{


}

auto deserialize_LessThanOrEqualValue(Buffer buffer_, Offset &offset_) -> LessThanOrEqualValue
{


}

auto serialize_GreaterThanValue(Buffer &buffer_, Offset &offset_, GreaterThanValue greaterThanValue_) -> void
{


}

auto deserialize_GreaterThanValue(Buffer buffer_, Offset &offset_) -> GreaterThanValue
{


}

auto serialize_GreaterThanOrEqualValue(Buffer &buffer_, Offset &offset_, GreaterThanOrEqualValue greaterThanOrEqualValue_) -> void
{


}

auto deserialize_GreaterThanOrEqualValue(Buffer buffer_, Offset &offset_) -> GreaterThanOrEqualValue
{


}

auto serialize_ValueCompare(Buffer &buffer_, Offset &offset_, ValueCompare valueCompare_) -> void
{









}

auto deserialize_ValueCompare(Buffer buffer_, Offset &offset_) -> ValueCompare
{









}

auto serialize_WhereCondition(Buffer buffer_, Offset offset_, WhereCondition whereCondition_) -> void
{

}

auto deserialize_WhereCondition(Buffer buffer_, Offset offset_) -> WhereCondition
{


}

auto serialize_AndCondition(Buffer buffer_, Offset offset_, AndCondition andCondition_) -> void
{

}

auto deserialize_AndCondition(Buffer buffer_, Offset offset_) -> AndCondition
{


}

auto serialize_OrCondition(Buffer buffer_, Offset offset_, OrCondition orCondition_) -> void
{

}

auto deserialize_OrCondition(Buffer buffer_, Offset offset_) -> OrCondition
{


}

auto serialize_EndWhereCondition(Buffer buffer_, Offset offset_, EndWhereCondition endWhereCondition_) -> void
{

}

auto deserialize_EndWhereCondition(Buffer buffer_, Offset offset_) -> EndWhereCondition
{


}

auto serialize_CountCondition(Buffer &buffer_, Offset &offset_, CountCondition countCondition_) -> void
{


}

auto deserialize_CountCondition(Buffer buffer_, Offset &offset_) -> CountCondition
{


}

auto serialize_EdgeCountCondition(Buffer &buffer_, Offset &offset_, EdgeCountCondition edgeCountCondition_) -> void
{


}

auto deserialize_EdgeCountCondition(Buffer buffer_, Offset &offset_) -> EdgeCountCondition
{


}

auto serialize_FromCountCondition(Buffer &buffer_, Offset &offset_, FromCountCondition fromCountCondition_) -> void
{


}

auto deserialize_FromCountCondition(Buffer buffer_, Offset &offset_) -> FromCountCondition
{


}

auto serialize_ToCountCondition(Buffer &buffer_, Offset &offset_, ToCountCondition toCountCondition_) -> void
{


}

auto deserialize_ToCountCondition(Buffer buffer_, Offset &offset_) -> ToCountCondition
{


}

auto serialize_DistanceCondition(Buffer &buffer_, Offset &offset_, DistanceCondition distanceCondition_) -> void
{


}

auto deserialize_DistanceCondition(Buffer buffer_, Offset &offset_) -> DistanceCondition
{


}

auto serialize_NotBeyondIdsCondition(Buffer &buffer_, Offset &offset_, NotBeyondIdsCondition notBeyondIdsCondition_) -> void
{


}

auto deserialize_NotBeyondIdsCondition(Buffer buffer_, Offset &offset_) -> NotBeyondIdsCondition
{


}

auto serialize_NotIdsCondition(Buffer &buffer_, Offset &offset_, NotIdsCondition notIdsCondition_) -> void
{


}

auto deserialize_NotIdsCondition(Buffer buffer_, Offset &offset_) -> NotIdsCondition
{


}

auto serialize_EdgeCondition(Buffer buffer_, Offset offset_, EdgeCondition edgeCondition_) -> void
{

}

auto deserialize_EdgeCondition(Buffer buffer_, Offset offset_) -> EdgeCondition
{


}

auto serialize_NodeCondition(Buffer buffer_, Offset offset_, NodeCondition nodeCondition_) -> void
{

}

auto deserialize_NodeCondition(Buffer buffer_, Offset offset_) -> NodeCondition
{


}

auto serialize_KeysCondition(Buffer &buffer_, Offset &offset_, KeysCondition keysCondition_) -> void
{


}

auto deserialize_KeysCondition(Buffer buffer_, Offset &offset_) -> KeysCondition
{


}

auto serialize_NotKeysCondition(Buffer &buffer_, Offset &offset_, NotKeysCondition notKeysCondition_) -> void
{


}

auto deserialize_NotKeysCondition(Buffer buffer_, Offset &offset_) -> NotKeysCondition
{


}

auto serialize_ValueCondition(Buffer &buffer_, Offset &offset_, ValueCondition valueCondition_) -> void
{



}

auto deserialize_ValueCondition(Buffer buffer_, Offset &offset_) -> ValueCondition
{


}

auto serialize_Condition(Buffer &buffer_, Offset &offset_, Condition condition_) -> void
{



















}

auto deserialize_Condition(Buffer buffer_, Offset &offset_) -> Condition
{



















}

auto serialize_Conditions(Buffer &buffer_, Offset &offset_, Conditions conditions_) -> void
{



}

auto deserialize_Conditions(Buffer buffer_, Offset &offset_) -> Conditions
{




}

auto serialize_InsertNodesQueryData(Buffer &buffer_, Offset &offset_, InsertNodesQueryData insertNodesQueryData_) -> void
{



}

auto deserialize_InsertNodesQueryData(Buffer buffer_, Offset &offset_) -> InsertNodesQueryData
{


}

auto serialize_InsertEdgesQueryData(Buffer &buffer_, Offset &offset_, InsertEdgesQueryData insertEdgesQueryData_) -> void
{





}

auto deserialize_InsertEdgesQueryData(Buffer buffer_, Offset &offset_) -> InsertEdgesQueryData
{


}

auto serialize_InsertEdgesEachQueryData(Buffer &buffer_, Offset &offset_, InsertEdgesEachQueryData insertEdgesEachQueryData_) -> void
{





}

auto deserialize_InsertEdgesEachQueryData(Buffer buffer_, Offset &offset_) -> InsertEdgesEachQueryData
{


}

auto serialize_InsertDataQueryData(Buffer &buffer_, Offset &offset_, InsertDataQueryData insertDataQueryData_) -> void
{



}

auto deserialize_InsertDataQueryData(Buffer buffer_, Offset &offset_) -> InsertDataQueryData
{


}

auto serialize_RemoveQueryData(Buffer &buffer_, Offset &offset_, RemoveQueryData removeQueryData_) -> void
{



}

auto deserialize_RemoveQueryData(Buffer buffer_, Offset &offset_) -> RemoveQueryData
{


}

auto serialize_SelectElementsQueryData(Buffer &buffer_, Offset &offset_, SelectElementsQueryData selectElementsQueryData_) -> void
{






}

auto deserialize_SelectElementsQueryData(Buffer buffer_, Offset &offset_) -> SelectElementsQueryData
{


}

auto serialize_SelectIdsQueryData(Buffer &buffer_, Offset &offset_, SelectIdsQueryData selectIdsQueryData_) -> void
{




}

auto deserialize_SelectIdsQueryData(Buffer buffer_, Offset &offset_) -> SelectIdsQueryData
{


}

auto serialize_SelectCountQueryData(Buffer &buffer_, Offset &offset_, SelectCountQueryData selectCountQueryData_) -> void
{




}

auto deserialize_SelectCountQueryData(Buffer buffer_, Offset &offset_) -> SelectCountQueryData
{


}

auto serialize_SelectKeyCountQueryData(Buffer &buffer_, Offset &offset_, SelectKeyCountQueryData selectKeyCountQueryData_) -> void
{



}

auto deserialize_SelectKeyCountQueryData(Buffer buffer_, Offset &offset_) -> SelectKeyCountQueryData
{


}

auto serialize_SelectPathElementsQuery(Buffer &buffer_, Offset &offset_, SelectPathElementsQuery selectPathElementsQuery_) -> void
{





}

auto deserialize_SelectPathElementsQuery(Buffer buffer_, Offset &offset_) -> SelectPathElementsQuery
{


}

auto serialize_SelectPathIdsQuery(Buffer &buffer_, Offset &offset_, SelectPathIdsQuery selectPathIdsQuery_) -> void
{




}

auto deserialize_SelectPathIdsQuery(Buffer buffer_, Offset &offset_) -> SelectPathIdsQuery
{


}

auto serialize_QueryData(Buffer &buffer_, Offset &offset_, QueryData queryData_) -> void
{














}

auto deserialize_QueryData(Buffer buffer_, Offset &offset_) -> QueryData
{














}

auto serialize_Query(Buffer &buffer_, Offset &offset_, std::unique_ptr<Query> query_) -> void
{


}

auto deserialize_Query(Buffer buffer_, Offset &offset_) -> std::unique_ptr<Query>
{


}

auto serialize_Result(Buffer &buffer_, Offset &offset_, Result result_) -> void
{



}

auto deserialize_Result(Buffer buffer_, Offset &offset_) -> Result
{


}

}